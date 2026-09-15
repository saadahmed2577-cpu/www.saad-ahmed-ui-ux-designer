const { body } = require('express-validator');

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty'),
];

const forgotPasswordRules = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const verifyOtpRules = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP code must be numeric'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

const resetPasswordRules = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP code must be numeric'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

const updateContactRules = [
  body('email')
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

module.exports = {
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
  updateContactRules,
};
