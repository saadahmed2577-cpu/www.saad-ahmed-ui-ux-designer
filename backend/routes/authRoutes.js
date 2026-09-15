const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
} = require('../middleware/rateLimiter');
const {
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
  updateContactRules,
} = require('../validators/authValidator');

// POST /api/auth/login
router.post('/login', loginLimiter, loginRules, validateRequest, authController.login);

// POST /api/auth/forgot-password (rate-limited)
router.post(
  '/forgot-password',
  otpRequestLimiter,
  forgotPasswordRules,
  validateRequest,
  authController.forgotPassword
);

// POST /api/auth/verify-otp (rate-limited)
router.post(
  '/verify-otp',
  otpVerifyLimiter,
  verifyOtpRules,
  validateRequest,
  authController.verifyOtp
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  resetPasswordRules,
  validateRequest,
  authController.resetPassword
);

// POST /api/auth/update-contact (requires JWT)
router.post(
  '/update-contact',
  protectAdmin,
  updateContactRules,
  validateRequest,
  authController.updateContact
);

// GET /api/auth/me (requires JWT)
router.get('/me', protectAdmin, authController.getMe);

module.exports = router;
