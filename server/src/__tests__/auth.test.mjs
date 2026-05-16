import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {
  let testUser;
  let authToken;

    beforeAll(async () => {
      // Connect to test database
      await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/envision_test');
    });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create a test user before each test
    testUser = await User.create({
      handle: 'testuser',
      password: await bcrypt.hash('testpassword123', 10),
      role: 'user'
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should signup a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          handle: 'newuser',
          password: 'newpassword123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('handle', 'newuser');
      expect(res.body.user).toHaveProperty('role', 'user');
    });

    it('should not signup user with existing handle', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          handle: testUser.handle,
          password: 'anotherpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should validate handle format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          handle: 'ab', // too short
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          handle: 'validhandle',
          password: '123' // too short
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          handle: testUser.handle,
          password: 'testpassword123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('handle', testUser.handle);
      authToken = res.body.token; // Save token for later tests
    });

    it('should not login user with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          handle: testUser.handle,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not login non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          handle: 'nonexistent',
          password: 'anypassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          handle: testUser.handle
          // missing password
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      // First login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          handle: testUser.handle,
          password: 'testpassword123'
        });

      const token = loginRes.body.token;

      // Then logout
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should not logout unauthenticated user', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send();

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});