import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('handle')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Handle must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Handle can only contain letters, numbers, underscores, and hyphens'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateLogin = [
  body('handle')
    .trim()
    .notEmpty()
    .withMessage('Handle is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};