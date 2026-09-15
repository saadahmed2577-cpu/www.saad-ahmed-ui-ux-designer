const { body, param } = require('express-validator');

const createPortfolioRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('techStack')
    .notEmpty()
    .withMessage('techStack is required (array or comma-separated string)'),
  body('imageUrl')
    .optional()
    .trim(),
  body('githubUrl')
    .optional()
    .trim(),
  body('liveUrl')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('date')
    .optional()
    .trim(),
];

const updatePortfolioRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid MongoDB ObjectId parameter in URL'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),
  body('description')
    .optional()
    .trim(),
  body('techStack')
    .optional(),
  body('imageUrl')
    .optional()
    .trim(),
  body('githubUrl')
    .optional()
    .trim(),
  body('liveUrl')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
];

const portfolioIdRule = [
  param('id')
    .isMongoId()
    .withMessage('Invalid MongoDB ObjectId parameter in URL'),
];

module.exports = {
  createPortfolioRules,
  updatePortfolioRules,
  portfolioIdRule,
};
