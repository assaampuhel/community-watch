import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

// Generate JWT token for a user
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '30d'
  });
};

// Create a test user
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    handle: 'testuser',
    rating: 0,
    role: 'user',
    avatar: null
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

// Create test users with different roles
export const createTestAdmin = async () => {
  return createTestUser({ handle: 'adminuser', role: 'admin' });
};

export const createTestModerator = async () => {
  return createTestUser({ handle: 'moduser', role: 'moderator' });
};

// Auth headers helper
export const getAuthHeaders = (user) => {
  const token = generateToken(user);
  return {
    'Authorization': `Bearer ${token}`
  };
};
