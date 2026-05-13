import request from 'supertest';
import mongoose from 'mongoose';

let app;

// Set environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/envision-test';
process.env.NODE_ENV = 'test';

// Connect to database and import app in beforeAll
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI);

  // Import app after env vars are set
  const module = await import('../index.js');
  app = module.default;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Health Check', () => {
  test('GET /health should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});
