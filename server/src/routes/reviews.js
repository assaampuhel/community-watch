import express from 'express';
import { createReview, getReviewsByReport, getReviewById, updateReview } from '../controllers/reviewController.js';
import { protect, moderatorOnly } from '../middleware/auth.js';
import { validateReview } from '../middleware/validate.js';
import { validateRequest } from '../middleware/validate.js';
import { validateReviewCommentUpdate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', protect, moderatorOnly, validateReview, validateRequest, createReview);
router.get('/report/:reportId', protect, getReviewsByReport);
router.get('/:reviewId', protect, getReviewById);
router.put('/:reviewId', protect, moderatorOnly, validateReviewCommentUpdate, validateRequest, updateReview);

export default router;
