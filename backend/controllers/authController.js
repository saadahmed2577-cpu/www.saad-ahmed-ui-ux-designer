const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginAdmin({ email, password });

  res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    data: result,
  });
});

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword({ email });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * POST /api/auth/verify-otp
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp({ email, otp });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * POST /api/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword({ email, otp, newPassword });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * POST /api/auth/update-contact (Admin protected)
 */
const updateContact = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.updateContact({
    adminId: req.admin._id,
    email,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/auth/me (Admin protected)
 */
const getMe = asyncHandler(async (req, res) => {
  const admin = await authService.getAdminProfile(req.admin._id);

  res.status(200).json({
    success: true,
    data: admin,
  });
});

module.exports = {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateContact,
  getMe,
};
