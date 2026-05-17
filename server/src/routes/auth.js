import express from 'express';
import { signup, login, logout, signupChallenge, signupVerify } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateSignup, validateLogin, validateRequest } from '../middleware/validateAuth.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, validateRequest, signup);
router.post('/signup-challenge', validateSignup, validateRequest, signupChallenge);
router.post('/signup-verify', signupVerify);
router.post('/login', validateLogin, validateRequest, login);

// Protected routes
router.post('/logout', protect, logout);

export default router;