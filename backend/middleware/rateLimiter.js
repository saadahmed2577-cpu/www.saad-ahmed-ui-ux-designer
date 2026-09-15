const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for login endpoint (Max 5 attempts per 15 minutes)
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Strict limiter for requesting OTPs (Max 3 OTP requests per 10 minutes)
 */
const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many OTP requests from this IP. Please wait 10 minutes before requesting again.',
  },
});

/**
 * Limiter for verifying OTPs (Max 5 verification attempts per 10 minutes)
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many incorrect verification attempts. Please try again later.',
  },
});

module.exports = {
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
};
