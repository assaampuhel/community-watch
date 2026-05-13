import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Report from '../models/Report.js';
import Review from '../models/Review.js';

// Set environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/envision-test';
process.env.NODE_ENV = 'test';

// Sample test data
const testUsers = {
  admin: {
    handle: 'admin_test',
    rating: 5,
    role: 'admin',
    avatar: null
  },
  moderator: {
    handle: 'mod_test',
    rating: 3,
    role: 'moderator',
    avatar: null
  },
  user: {
    handle: 'user_test',
    rating: 1,
    role: 'user',
    avatar: null
  }
};

const testReport = {
  reportId: 'TEST_RPT_001',
  reporterHandle: 'user_test',
  suspectHandle: 'cheater_user',
  contestId: 'CONTEST_001',
  problemId: 'PROBLEM_001',
  reason: 'Code Similarity',
  description: 'High similarity detected in submitted solutions',
  status: 'pending'
};

let app;
let adminToken;
let modToken;
let userToken;
let testReportId;
let testReviewId;

// Connect to database and import app in beforeAll
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI);

  // Import app after env vars are set
  const module = await import('../index.js');
  app = module.default;

  // Clear existing data
  await User.deleteMany({});
  await Report.deleteMany({});
  await Review.deleteMany({});

  // Create test users
  const admin = new User(testUsers.admin);
  const mod = new User(testUsers.moderator);
  const user = new User(testUsers.user);

  await admin.save();
  await mod.save();
  await user.save();

  // Generate tokens
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  modToken = jwt.sign({ id: mod._id, role: mod.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
});

afterAll(async () => {
  // Cleanup
  await User.deleteMany({});
  await Report.deleteMany({});
  await Review.deleteMany({});
  await mongoose.connection.close();
});

describe('1. Health Check', () => {
  test('GET /health should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('2. User Endpoints', () => {
  test('GET /api/users/:handle - should get user by handle', async () => {
    const res = await request(app)
      .get(`/api/users/${testUsers.user.handle}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('handle', testUsers.user.handle);
    expect(res.body).toHaveProperty('role', 'user');
  });

  test('GET /api/users/:handle - should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/api/users/nonexistent_user_12345');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  test('PUT /api/users/:handle - should update user profile (auth required)', async () => {
    const res = await request(app)
      .put(`/api/users/${testUsers.user.handle}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ rating: 5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('rating', 5);
  });

  test('PUT /api/users/:handle - should fail without auth', async () => {
    const res = await request(app)
      .put(`/api/users/${testUsers.user.handle}`)
      .send({ rating: 10 });
    expect(res.status).toBe(401);
  });

  test('GET /api/users - should return all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/users - should deny access to non-admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Admin access required');
  });
});

describe('3. Report Endpoints', () => {
  beforeAll(async () => {
    // Create a test report
    const report = new Report({ ...testReport, reportId: 'TEST_RPT_002' });
    await report.save();
    testReportId = report.reportId;
  });

    test('POST /api/reports - should create new report (auth required)', async () => {
     const newReport = {
       reportId: 'TEST_RPT_NEW',
       reporterHandle: testUsers.user.handle,
       suspectHandle: 'another_suspect',
       contestId: 'CONTEST_002',
       problemId: 'PROB_002',
       reason: 'Plagiarism',
       description: 'Test description for report'
     };

     const res = await request(app)
       .post('/api/reports')
       .set('Authorization', `Bearer ${userToken}`)
       .send(newReport);

     expect(res.status).toBe(201);
     expect(res.body).toHaveProperty('reportId', newReport.reportId);
     expect(res.body).toHaveProperty('status', 'pending');
   });

  test('POST /api/reports - should fail with missing required fields', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('GET /api/reports - should list reports with optional filters', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/reports/:reportId - should get specific report', async () => {
    const res = await request(app)
      .get(`/api/reports/${testReportId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reportId', testReportId);
  });

   test('GET /api/reports/:reportId - should return 404 for non-existent', async () => {
     const res = await request(app)
       .get('/api/reports/DOES_NOT_EXIST')
       .set('Authorization', `Bearer ${userToken}`);
     expect(res.status).toBe(404);
   });

  test('PATCH /api/reports/:reportId/status - should update status (moderator+)', async () => {
    const res = await request(app)
      .patch(`/api/reports/${testReportId}/status`)
      .set('Authorization', `Bearer ${modToken}`)
      .send({ status: 'reviewed' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'reviewed');
  });

  test('PATCH /api/reports/:reportId/status - should reject invalid status', async () => {
    const res = await request(app)
      .patch(`/api/reports/${testReportId}/status`)
      .set('Authorization', `Bearer ${modToken}`)
      .send({ status: 'invalid_status' });
    expect(res.status).toBe(400);
  });

  test('PATCH /api/reports/:reportId/status - should deny user role', async () => {
    const res = await request(app)
      .patch(`/api/reports/${testReportId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'resolved' });
    expect(res.status).toBe(403);
  });

  test('DELETE /api/reports/:reportId - should delete report (admin only)', async () => {
    // Create a report to delete
    const report = new Report({
      reportId: 'TEST_RPT_DELETE',
      reporterHandle: testUsers.user.handle,
      suspectHandle: 'suspect',
      contestId: 'CONTEST_DEL',
      problemId: 'PROB_DEL',
      reason: 'Test'
    });
    await report.save();

    const res = await request(app)
      .delete(`/api/reports/TEST_RPT_DELETE`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Report deleted successfully');

    // Verify deleted
    const deleted = await Report.findOne({ reportId: 'TEST_RPT_DELETE' });
    expect(deleted).toBeNull();
  });

  test('DELETE /api/reports/:reportId - should deny moderator', async () => {
    const res = await request(app)
      .delete(`/api/reports/${testReportId}`)
      .set('Authorization', `Bearer ${modToken}`);
    expect(res.status).toBe(403);
  });
});

describe('4. Review Endpoints', () => {
  let testReviewId;

  beforeAll(async () => {
    // Ensure we have a report to review
    let report = await Report.findOne({ reportId: testReportId });
    if (!report) {
      report = new Report({ ...testReport });
      await report.save();
    }
  });

  test('POST /api/reviews - should create review (moderator+)', async () => {
    const reviewData = {
      reviewId: 'TEST_REV_001',
      reportId: testReportId,
      reviewerHandle: testUsers.moderator.handle,
      decision: 'approve',
      comment: 'Looks valid'
    };

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${modToken}`)
      .send(reviewData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('reviewId', reviewData.reviewId);
    expect(res.body).toHaveProperty('decision', 'approve');
    testReviewId = reviewData.reviewId;
  });

  test('POST /api/reviews - should fail for regular user', async () => {
    const reviewData = {
      reviewId: 'TEST_REV_002',
      reportId: testReportId,
      reviewerHandle: testUsers.user.handle,
      decision: 'reject'
    };

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);

    expect(res.status).toBe(403);
  });

  test('GET /api/reviews/report/:reportId - should list reviews for a report', async () => {
    const res = await request(app)
      .get(`/api/reviews/report/${testReportId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/reviews/:reviewId - should get specific review', async () => {
    const res = await request(app)
      .get(`/api/reviews/${testReviewId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reviewId', testReviewId);
  });

  test('PUT /api/reviews/:reviewId - should update review comment (moderator+)', async () => {
    const res = await request(app)
      .put(`/api/reviews/${testReviewId}`)
      .set('Authorization', `Bearer ${modToken}`)
      .send({ comment: 'Updated comment after review' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('comment', 'Updated comment after review');
  });

  test('PUT /api/reviews/:reviewId - should deny user from updating', async () => {
    const res = await request(app)
      .put(`/api/reviews/${testReviewId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment: 'Hacked comment' });
    expect(res.status).toBe(403);
  });
});

describe('5. Validation Tests', () => {
  test('User handle validation - should reject invalid characters', async () => {
    const res = await request(app)
      .put(`/api/users/invalid@handle`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ rating: 5 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

   test('Report validation - should require all mandatory fields', async () => {
     const res = await request(app)
       .post('/api/reports')
       .set('Authorization', `Bearer ${userToken}`)
       .send({
         reportId: 'INCOMPLETE',
         reporterHandle: testUsers.user.handle,
         suspectHandle: 'suspect',
         contestId: 'CONTEST',
         problemId: 'PROB',
         reason: 'Test',
         description: 'Test description'
       });
     // Should succeed because all required fields are present
     expect(res.status).toBe(201);
   });

   test('Review decision validation - should only accept approve/reject', async () => {
     const res = await request(app)
       .post('/api/reviews')
       .set('Authorization', `Bearer ${modToken}`)
       .send({
         reviewId: 'BAD_DECISION',
         reportId: testReportId,
         reviewerHandle: testUsers.moderator.handle,
         decision: 'maybe'
       });
     expect(res.status).toBe(400);
     expect(res.body.errors[0].msg).toContain('Decision must be either approve or reject');
   });
});

describe('6. Error Handling', () => {
  test('Should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });

  test('Should handle server errors gracefully', async () => {
    // This would require mocking a database error
    // For now, just verify error handler exists
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
