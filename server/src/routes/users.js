import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateUser, validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.get('/:handle', getProfile);
router.put('/:handle', protect, validateUser, validateRequest, updateProfile);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
