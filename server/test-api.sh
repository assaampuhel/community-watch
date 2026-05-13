# API Test Suite for Envision Backend
# Prerequisites: MongoDB running, server started on port 3000

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Envision Backend API Test Suite ===${NC}\n"

# Store tokens for authenticated requests
USER_TOKEN=""
ADMIN_TOKEN=""
MOD_TOKEN=""

# Test user data
USER_HANDLE="testuser_$(date +%s)"
ADMIN_HANDLE="admin_$(date +%s)"
MOD_HANDLE="mod_$(date +%s)"
REPORT_ID="RPT$(date +%s)"
REVIEW_ID="REV$(date +%s)"

# Helper function
check_response() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
    else
        echo -e "${RED}✗ FAIL${NC}: $2 (Status: $1)"
    fi
}

# ============================================
# 1. HEALTH CHECK
# ============================================
echo -e "\n${YELLOW}1. Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
check_response $response "Server health check"

# ============================================
# 2. USER ENDPOINTS
# ============================================
echo -e "\n${YELLOW}2. User Endpoints${NC}"

# 2.1 Get non-existent user
echo -e "\n--- Get non-existent user ---"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/users/nonexistentuser")
body=$(echo "$response" | head -n -1)
code=$(echo "$response" | tail -n1)
echo "$body" | head -c 200
check_response $code "GET /api/users/:handle (non-existent)"

# 2.2 Create test users via direct DB (skip - we need auth to create)
# We'll need to manually create users in DB or add registration endpoint
echo -e "\n${YELLOW}Note:${NC} Users must be created directly in MongoDB for testing."
echo -e "Run these commands in MongoDB shell or Compass:"
echo ""
echo "db.users.insertMany(["
echo "  {"
echo "    handle: \"$USER_HANDLE\","
echo "    rating: 0,"
echo "    role: \"user\","
echo "    avatar: null,"
echo "    createdAt: new Date(),"
echo "    updatedAt: new Date()"
echo "  },"
echo "  {"
echo "    handle: \"$ADMIN_HANDLE\","
echo "    rating: 0,"
echo "    role: \"admin\","
echo "    avatar: null,"
echo "    createdAt: new Date(),"
echo "    updatedAt: new Date()"
echo "  },"
echo "  {"
echo "    handle: \"$MOD_HANDLE\","
echo "    rating: 0,"
echo "    role: \"moderator\","
echo "    avatar: null,"
echo "    createdAt: new Date(),"
echo "    updatedAt: new Date()"
echo "  }"
echo "])"

read -p "Have you created the test users in MongoDB? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 2.3 Get existing user
    echo -e "\n--- Get existing user ---"
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL/users/$USER_HANDLE")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 200
    check_response $code "GET /api/users/$USER_HANDLE"

    # Extract user ID for potential future use
    USER_ID=$(echo "$body" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "User ID: $USER_ID"

    # 2.4 Update user (requires auth - will test after we get token)
    # 2.5 Get all users (admin only - will test after admin token)
fi

# ============================================
# 3. AUTHENTICATION & JWT
# ============================================
echo -e "\n${YELLOW}3. Authentication Setup${NC}"
echo -e "To test protected endpoints, you need JWT tokens."
echo -e "\nGenerate tokens by calling a login endpoint, or create them manually:"
echo ""
echo "const jwt = require('jsonwebtoken');"
echo "const token = jwt.sign({ id: '$USER_ID', role: 'user' }, 'your-jwt-secret', { expiresIn: '30d' });"
echo "console.log(token);"
echo ""
echo -e "${YELLOW}Note:${NC} The current implementation requires JWT but has no login/register endpoint."
echo -e "You'll need to either:"
echo -e "1. Add login/register endpoints"
echo -e "2. Generate tokens manually and use them in tests"
echo -e "3. Temporarily disable auth to test other endpoints"

# ============================================
# 4. REPORT ENDPOINTS
# ============================================
echo -e "\n${YELLOW}4. Report Endpoints (require auth)${NC}"
echo -e "All report endpoints require authentication."
echo -e "\nTo test:"
echo -e "1. Obtain JWT token (see above)"
echo -e "2. Add header: -H \"Authorization: Bearer YOUR_TOKEN\""

# Test report creation (requires auth, evidenceImage optional)
echo -e "\n--- POST /api/reports (requires auth) ---"
if [ -n "$USER_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"reportId\": \"$REPORT_ID\",
        \"reporterHandle\": \"$USER_HANDLE\",
        \"suspectHandle\": \"suspect_user\",
        \"contestId\": \"CONTEST001\",
        \"problemId\": \"PROB001\",
        \"reason\": \"Cheating\",
        \"description\": \"Suspected code sharing\"
      }" \
      "$BASE_URL/reports")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 300
    check_response $code "POST /api/reports"

    if [ $code -eq 201 ]; then
        # Test GET reports
        echo -e "\n--- GET /api/reports ---"
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $USER_TOKEN" "$BASE_URL/reports")
        body=$(echo "$response" | head -n -1)
        code=$(echo "$response" | tail -n1)
        echo "$body" | head -c 200
        check_response $code "GET /api/reports"

        # Test GET report by ID
        echo -e "\n--- GET /api/reports/$REPORT_ID ---"
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $USER_TOKEN" "$BASE_URL/reports/$REPORT_ID")
        body=$(echo "$response" | head -n -1)
        code=$(echo "$response" | tail -n1)
        echo "$body" | head -c 200
        check_response $code "GET /api/reports/:reportId"

        # Test PATCH status update (requires mod/admin role)
        echo -e "\n--- PATCH /api/reports/$REPORT_ID/status (requires mod+) ---"
        # This would need MOD_TOKEN or ADMIN_TOKEN
        echo -e "${YELLOW}Skipped${NC}: Need moderator/admin token"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No auth token available"
fi

# ============================================
# 5. REVIEW ENDPOINTS
# ============================================
echo -e "\n${YELLOW}5. Review Endpoints (require moderator+)${NC}"
echo -e "All review endpoints require moderator or admin role."

if [ -n "$MOD_TOKEN" ]; then
    # 5.1 Create review
    echo -e "\n--- POST /api/reviews ---"
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $MOD_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"reviewId\": \"$REVIEW_ID\",
        \"reportId\": \"$REPORT_ID\",
        \"reviewerHandle\": \"$MOD_HANDLE\",
        \"decision\": \"approve\",
        \"comment\": \"Valid report\"
      }" \
      "$BASE_URL/reviews")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 200
    check_response $code "POST /api/reviews"

    if [ $code -eq 201 ]; then
        # 5.2 Get reviews by report
        echo -e "\n--- GET /api/reviews/report/$REPORT_ID ---"
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $MOD_TOKEN" "$BASE_URL/reviews/report/$REPORT_ID")
        body=$(echo "$response" | head -n -1)
        code=$(echo "$response" | tail -n1)
        echo "$body" | head -c 200
        check_response $code "GET /api/reviews/report/:reportId"

        # 5.3 Get review by ID
        echo -e "\n--- GET /api/reviews/$REVIEW_ID ---"
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $MOD_TOKEN" "$BASE_URL/reviews/$REVIEW_ID")
        body=$(echo "$response" | head -n -1)
        code=$(echo "$response" | tail -n1)
        echo "$body" | head -c 200
        check_response $code "GET /api/reviews/:reviewId"

        # 5.4 Update review
        echo -e "\n--- PUT /api/reviews/$REVIEW_ID ---"
        response=$(curl -s -w "\n%{http_code}" \
          -X PUT \
          -H "Authorization: Bearer $MOD_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{"comment": "Updated comment"}' \
          "$BASE_URL/reviews/$REVIEW_ID")
        body=$(echo "$response" | head -n -1)
        code=$(echo "$response" | tail -n1)
        echo "$body" | head -c 200
        check_response $code "PUT /api/reviews/:reviewId"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No moderator/admin token available"
fi

# ============================================
# 6. VALIDATION TESTS
# ============================================
echo -e "\n${YELLOW}6. Validation Tests${NC}"

# 6.1 Create report with missing fields (requires auth)
echo -e "\n--- POST /api/reports with missing fields ---"
if [ -n "$USER_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{}' \
      "$BASE_URL/reports")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 200
    if [ $code -eq 400 ]; then
        echo -e "${GREEN}✓ PASS${NC}: Validation working - returns 400"
    else
        echo -e "${RED}✗ FAIL${NC}: Expected 400, got $code"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No auth token"
fi

# 6.2 Create report with invalid status
echo -e "\n--- PATCH /api/reports/status with invalid status ---"
if [ -n "$MOD_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -X PATCH \
      -H "Authorization: Bearer $MOD_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"status": "invalid_status"}' \
      "$BASE_URL/reports/$REPORT_ID/status")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 200
    if [ $code -eq 400 ]; then
        echo -e "${GREEN}✓ PASS${NC}: Invalid status rejected"
    else
        echo -e "${RED}✗ FAIL${NC}: Expected 400, got $code"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No mod/admin token"
fi

# 6.3 Create review with invalid decision
echo -e "\n--- POST /api/reviews with invalid decision ---"
if [ -n "$MOD_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $MOD_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "reviewId": "TEST001",
        "reportId": "RPT001",
        "reviewerHandle": "'$MOD_HANDLE'",
        "decision": "maybe"
      }' \
      "$BASE_URL/reviews")
    body=$(echo "$response" | head -n -1)
    code=$(echo "$response" | tail -n1)
    echo "$body" | head -c 200
    if [ $code -eq 400 ]; then
        echo -e "${GREEN}✓ PASS${NC}: Invalid decision rejected"
    else
        echo -e "${RED}✗ FAIL${NC}: Expected 400, got $code"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No mod/admin token"
fi

# ============================================
# 7. AUTHORIZATION TESTS
# ============================================
echo -e "\n${YELLOW}7. Authorization Tests (Role-based Access)${NC}"

# 7.1 Regular user accessing admin-only endpoint
echo -e "\n--- GET /api/users with user role ---"
if [ -n "$USER_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $USER_TOKEN" \
      "$BASE_URL/users")
    code=$(echo "$response" | tail -n1)
    if [ $code -eq 403 ]; then
        echo -e "${GREEN}✓ PASS${NC}: User denied access to admin endpoint"
    else
        echo -e "${RED}✗ FAIL${NC}: Expected 403, got $code"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No user token"
fi

# 7.2 User accessing mod-only endpoint
echo -e "\n--- POST /api/reviews with user role ---"
if [ -n "$USER_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "reviewId": "TEST002",
        "reportId": "RPT001",
        "reviewerHandle": "'$USER_HANDLE'",
        "decision": "approve"
      }' \
      "$BASE_URL/reviews")
    code=$(echo "$response" | tail -n1)
    if [ $code -eq 403 ]; then
        echo -e "${GREEN}✓ PASS${NC}: User denied access to mod endpoint"
    else
        echo -e "${RED}✗ FAIL${NC}: Expected 403, got $code"
    fi
else
    echo -e "${YELLOW}Skipped${NC}: No user token"
fi

# ============================================
# 8. UNAUTHENTICATED REQUESTS
# ============================================
echo -e "\n${YELLOW}8. Unauthenticated Requests${NC}"

# 8.1 Access protected endpoint without token
echo -e "\n--- GET /api/users without token ---"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/users")
code=$(echo "$response" | tail -n1)
if [ $code -eq 401 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Unauthenticated request denied"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 401, got $code"
fi

# 8.2 Create report without token
echo -e "\n--- POST /api/reports without token ---"
response=$(curl -s -w "\n%{http_code}" \
  -H "Content-Type: application/json" \
  -d '{
    "reportId": "RPT999",
    "reporterHandle": "test",
    "suspectHandle": "suspect",
    "contestId": "C001",
    "problemId": "P001",
    "reason": "Test"
  }' \
  "$BASE_URL/reports")
code=$(echo "$response" | tail -n1)
if [ $code -eq 401 ]; then
    echo -e "${GREEN}✓ PASS${NC}: Unauthenticated POST denied"
else
    echo -e "${RED}✗ FAIL${NC}: Expected 401, got $code"
fi

# ============================================
# 9. FILE UPLOAD TEST
# ============================================
echo -e "\n${YELLOW}9. File Upload Test${NC}"
if [ -n "$USER_TOKEN" ]; then
    # Create a test image file
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" | base64 -d > /tmp/test-image.png

    echo -e "\n--- POST /api/reports with image ---"
    response=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -F "reportId=$REPORT_ID" \
      -F "reporterHandle=$USER_HANDLE" \
      -F "suspectHandle=suspect_user" \
      -F "contestId=CONTEST001" \
      -F "problemId=PROB001" \
      -F "reason=Cheating" \
      -F "evidenceImage=@/tmp/test-image.png;type=image/png" \
      "$BASE_URL/reports")
    code=$(echo "$response" | tail -n1)
    if [ $code -eq 201 ]; then
        echo -e "${GREEN}✓ PASS${NC}: File upload successful"
        # Check if evidenceImage field is populated
        if echo "$response" | grep -q "evidenceImage"; then
            echo -e "${GREEN}✓ PASS${NC}: evidenceImage field set"
        else
            echo -e "${YELLOW}⚠ WARNING${NC}: evidenceImage may not be saved"
        fi
    else
        echo -e "${RED}✗ FAIL${NC}: File upload failed (Status: $code)"
        echo "$response" | head -c 200
    fi
    rm -f /tmp/test-image.png
else
    echo -e "${YELLOW}Skipped${NC}: No user token"
fi

# ============================================
# SUMMARY
# ============================================
echo -e "\n${YELLOW}=== Test Suite Complete ===${NC}"
echo -e "\nManual verification needed:"
echo "1. Check if evidenceImage URLs are valid for uploaded files"
echo "2. Verify timestamps (createdAt, updatedAt) are present"
echo "3. Test with different user roles to ensure role-based access works"
echo "4. Run server in production mode: NODE_ENV=production npm start"
echo ""
echo -e "${YELLOW}Note:${NC} Some tests were skipped due to missing auth tokens."
echo -e "Create users in MongoDB first, then generate JWT tokens to test protected endpoints."
echo ""
echo -e "To generate JWT token manually in Node:"
echo "  node -e \"const jwt=require('jsonwebtoken');console.log(jwt.sign({id:'USER_ID',role:'admin'},'your-jwt-secret',{expiresIn:'30d'}));\""
