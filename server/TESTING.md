# API Testing Guide

## Quick Start

### 1. Start MongoDB
Ensure MongoDB is running locally:
```bash
# Windows
net start MongoDB

# Or using MongoDB Compass (start server from there)
# Or run mongod directly
mongod
```

### 2. Seed Test Data
```bash
cd server
mongosh < seed-test-data.js
```
This creates 3 users (testuser, adminuser, moduser) and sample data.

### 3. Start the Server
```bash
cd server
npm run dev
```
Server runs on http://localhost:3000

---

## Automated Tests (Jest + Supertest)

```bash
cd server
npm test
```

**Note:** The automated tests require:
- MongoDB running on `mongodb://localhost:27017/envision-test`
- Test database will be cleaned before/after tests
- Tests create and delete their own data

The Jest test suite covers:
- Health check endpoint
- User CRUD operations with role-based access
- Report CRUD operations with validation
- Review operations with moderator/admin restrictions
- Request validation (missing fields, invalid enums)
- Authentication (JWT) and authorization (role checks)
- File upload handling
- Error handling (404, 500)
- Unauthorized access attempts

---

## Manual API Testing

Use the provided script:
```bash
cd server
chmod +x test-api.sh  # On Linux/Mac
./test-api.sh
```

Or run commands manually (see examples below).

---

## API Endpoints Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
All endpoints except `/health` and `/api` require JWT Bearer token.

Include header:
```
Authorization: Bearer <JWT_TOKEN>
```

To generate a token for testing:
```javascript
// In mongosh or Node.js
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: 'USER_ID_FROM_DB', role: 'user' },
  'your-jwt-secret',
  { expiresIn: '30d' }
);
```

---

## Endpoint Examples

### Users

**GET /api/users/:handle**
```bash
curl http://localhost:3000/api/users/testuser
```

**PUT /api/users/:handle** (auth required)
```bash
curl -X PUT http://localhost:3000/api/users/testuser \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "avatar": "https://example.com/avatar.png"}'
```

**GET /api/users** (admin only)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Reports

**POST /api/reports** (auth required, multipart/form-data supports file upload)
```bash
# Without image
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportId": "RPT001",
    "reporterHandle": "testuser",
    "suspectHandle": "cheater123",
    "contestId": "CONTEST_001",
    "problemId": "PROBLEM_A",
    "reason": "Code Similarity",
    "description": "Detailed description"
  }'

# With image upload
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "reportId=RPT002" \
  -F "reporterHandle=testuser" \
  -F "suspectHandle=cheater456" \
  -F "contestId=CONTEST_002" \
  -F "problemId=PROBLEM_B" \
  -F "reason=Impersonation" \
  -F "evidenceImage=@/path/to/image.png"
```

**GET /api/reports** (auth required, supports filters)
```bash
# All reports
curl http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl "http://localhost:3000/api/reports?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by contest/problem
curl "http://localhost:3000/api/reports?contestId=CONTEST_001&problemId=PROBLEM_A" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**GET /api/reports/:reportId** (auth required)
```bash
curl http://localhost:3000/api/reports/RPT001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**PATCH /api/reports/:reportId/status** (moderator/admin only)
```bash
curl -X PATCH http://localhost:3000/api/reports/RPT001/status \
  -H "Authorization: Bearer MOD_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```
Valid statuses: `pending`, `reviewed`, `resolved`

**DELETE /api/reports/:reportId** (admin only)
```bash
curl -X DELETE http://localhost:3000/api/reports/RPT001 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Reviews

**POST /api/reviews** (moderator/admin only)
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer MOD_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewId": "REV001",
    "reportId": "RPT001",
    "reviewerHandle": "moduser",
    "decision": "approve",
    "comment": "Evidence is convincing"
  }'
```
Valid decisions: `approve`, `reject`

**GET /api/reviews/report/:reportId** (auth required)
```bash
curl http://localhost:3000/api/reviews/report/RPT001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**GET /api/reviews/:reviewId** (auth required)
```bash
curl http://localhost:3000/api/reviews/REV001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**PUT /api/reviews/:reviewId** (moderator/admin only)
```bash
curl -X PUT http://localhost:3000/api/reviews/REV001 \
  -H "Authorization: Bearer MOD_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Updated comment after further discussion"}'
```

---

## Expected Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK (successful GET/PUT/PATCH) |
| 201 | Created (successful POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## Test Scenarios Checklist

### User Tests
- [ ] Get user by handle (success)
- [ ] Get non-existent user (404)
- [ ] Update own profile (success)
- [ ] Update another user's profile (should still work - no ownership check in current implementation)
- [ ] Get all users as admin (success)
- [ ] Get all users as regular user (403)

### Report Tests
- [ ] Create report with all fields (success)
- [ ] Create report without required fields (400)
- [ ] List reports (success)
- [ ] Filter reports by status/contestId/problemId (success)
- [ ] Get specific report (success)
- [ ] Get non-existent report (404)
- [ ] Update report status as moderator (success)
- [ ] Update report status as user (403)
- [ ] Update report to invalid status (400)
- [ ] Delete report as admin (success)
- [ ] Delete report as moderator (403)
- [ ] Create report without auth (401)

### Review Tests
- [ ] Create review as moderator (success)
- [ ] Create review as user (403)
- [ ] Get reviews by report (success)
- [ ] Get specific review (success)
- [ ] Update review comment as moderator (success)
- [ ] Update review as user (403)
- [ ] Create review with invalid decision (400)
- [ ] Create review without auth (401)

### Validation Tests
- [ ] Invalid user handle format (400)
- [ ] Missing report required fields (400)
- [ ] Invalid review decision value (400)
- [ ] Non-mongoID format (404)

### Security Tests
- [ ] SQL injection attempts (should be safe with MongoDB)
- [ ] XSS in comments (stored as plain text)
- [ ] Path traversal in file uploads (multer prevents this)
- [ ] Unauthorized access to protected endpoints

### File Upload Tests
- [ ] Upload valid image (png/jpg/gif)
- [ ] Upload file exceeding size limit (5MB)
- [ ] Upload non-image file (should reject)
- [ ] Create report without image (should succeed)

---

## Performance Tests (Optional)

```bash
# Use Apache Bench or wrk
ab -n 100 -c 10 http://localhost:3000/health
ab -n 50 -c 5 http://localhost:3000/api/users/testuser

# With authentication
TOKEN=$(your-token-generation-command)
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/reports
```

---

## Notes

1. The current implementation uses local file storage for uploads (`/src/uploads/`). For production, replace with Cloudinary.
2. JWT secret is in `.env`. Change it in production.
3. No user registration/login endpoint exists yet - users must be created directly in the database.
4. Timestamps (`createdAt`, `updatedAt`) are automatically added by Mongoose.
5. File size limit: 5MB per image.

---

## Troubleshooting

**Module not found errors:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

**MongoDB connection refused:**
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check connection string in `.env`

**Jest tests fail with "Cannot find module":**
Make sure `"type": "module"` is in package.json and jest config has `"extensionsToTreatAsEsm": [".js"]`.

**Port already in use:**
Change PORT in `.env` or kill the process on port 3000.
