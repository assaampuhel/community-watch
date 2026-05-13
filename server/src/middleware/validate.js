import { body, param, validationResult } from 'express-validator';

export const validateReportStatusUpdate = [
  body('status').optional().isIn(['pending', 'reviewed', 'resolved'])
];

export const validateReviewCommentUpdate = [
  body('comment').optional().isString()
];

export const validateUser = [
  param('handle').matches(/^[a-zA-Z0-9_-]+$/).withMessage('Handle can only contain letters, numbers, underscores, and hyphens'),
  body('avatar').optional().isURL(),
  body('rating').optional().isInt({ min: 0, max: 5 }),
  body('role').optional().isIn(['admin', 'moderator', 'user'])
];

export const validateReview = [
  body('reviewId').notEmpty().isString(),
  body('reportId').notEmpty().isString(),
  body('reviewerHandle').notEmpty().isString(),
  body('decision').notEmpty().isIn(['approve', 'reject']).withMessage('Decision must be either approve or reject'),
  body('comment').optional().isString()
];

export const validateReport = [
  body('reportId').notEmpty().isString(),
  body('reporterHandle').notEmpty().isString(),
  body('suspectHandle').notEmpty().isString(),
  body('contestId').notEmpty().isString(),
  body('problemId').notEmpty().isString(),
  body('reason').notEmpty().isString(),
  body('description').notEmpty().isString(),
  body('evidenceImage').optional().isURL()
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};