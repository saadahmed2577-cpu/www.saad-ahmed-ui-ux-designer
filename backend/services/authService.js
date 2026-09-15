const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Otp = require('../models/Otp');
const env = require('../config/env');
const generateOtp = require('../utils/generateOtp');
const { sendEmail } = require('./emailService');

/**
 * Custom Error helper with HTTP status code
 */
class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Generates JWT token for the admin
 */
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRE,
    }
  );
};

/**
 * Admin Login
 */
const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!admin) {
    throw new ServiceError('Invalid email or password credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ServiceError('Invalid email or password credentials', 401);
  }

  const token = generateToken(admin);

  return {
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  };
};

/**
 * Forgot Password: Generates 6-digit OTP, saves in MongoDB, dispatches Email via SMTP
 */
const forgotPassword = async ({ email }) => {
  const normalizedEmail = (email || env.ADMIN_EMAIL).toLowerCase().trim();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    throw new ServiceError('Admin account not found with this email address', 404);
  }

  // Invalidate any existing active OTPs for this email
  await Otp.deleteMany({ email: admin.email });

  // Generate 6-digit OTP
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save new OTP in MongoDB (TTL index will auto clean up if unused)
  await Otp.create({
    email: admin.email,
    otp: otpCode,
    expiresAt,
    isVerified: false,
  });

  console.log(`🔐 [AuthService] OTP generated for Admin (${admin.email}): ${otpCode}`);

  // Send Email via generic SMTP
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; background: #0c0d0e; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #222;">
      <h2 style="color: #D91E2A; margin: 0 0 12px 0; text-transform: uppercase;">Portfolio Admin Recovery</h2>
      <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6;">You requested a password reset for your portfolio management portal.</p>
      <div style="background: #16171a; border: 1px solid #333; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
        <span style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">6-Digit Security OTP</span>
        <strong style="font-size: 36px; letter-spacing: 6px; color: #ffffff; font-family: monospace;">${otpCode}</strong>
      </div>
      <p style="color: #777777; font-size: 12px; margin: 0;">This OTP code is valid for <strong>10 minutes</strong>. Never share this code with anyone.</p>
    </div>
  `;

  // Dispatch Email only via SMTP
  const emailResult = await sendEmail({
    to: admin.email,
    subject: 'Your Portfolio Admin Password Reset OTP',
    html: emailHtml,
  });

  return {
    message: 'OTP has been dispatched to your registered recovery email.',
    email: admin.email,
    expiresInMinutes: 10,
    emailDelivered: emailResult.success,
  };
};

/**
 * Verify 6-digit OTP
 */
const verifyOtp = async ({ email, otp }) => {
  const normalizedEmail = (email || env.ADMIN_EMAIL).toLowerCase().trim();
  const trimmedOtp = String(otp).trim();

  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    otp: trimmedOtp,
  });

  if (!otpRecord) {
    throw new ServiceError('Invalid OTP code. Please verify and try again.', 400);
  }

  if (new Date() > otpRecord.expiresAt) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new ServiceError('This OTP has expired. Please request a new one.', 400);
  }

  // Mark as verified
  otpRecord.isVerified = true;
  await otpRecord.save();

  return {
    message: 'OTP verified successfully. You may now reset your password.',
  };
};

/**
 * Reset Password after OTP verification
 */
const resetPassword = async ({ email, otp, newPassword }) => {
  const normalizedEmail = (email || env.ADMIN_EMAIL).toLowerCase().trim();
  const trimmedOtp = String(otp).trim();

  if (!newPassword || newPassword.length < 6) {
    throw new ServiceError('New password must be at least 6 characters long', 400);
  }

  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    otp: trimmedOtp,
    isVerified: true,
  });

  if (!otpRecord) {
    throw new ServiceError('OTP is either invalid, unverified, or expired.', 400);
  }

  if (new Date() > otpRecord.expiresAt) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new ServiceError('This OTP has expired. Please request a new one.', 400);
  }

  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    throw new ServiceError('Admin account not found.', 404);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();

  // Delete used OTP
  await Otp.deleteOne({ _id: otpRecord._id });

  return {
    message: 'Admin password reset successfully. You can now login with your new password.',
  };
};

/**
 * Update Admin Contact Information (Recovery Email) - Admin authenticated only
 */
const updateContact = async ({ adminId, email }) => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ServiceError('Admin account not found', 404);
  }

  if (email) {
    admin.email = email.toLowerCase().trim();
  }

  await admin.save();

  return {
    message: 'Admin recovery email updated successfully.',
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  };
};

/**
 * Get Profile
 */
const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId).select('-password');
  if (!admin) {
    throw new ServiceError('Admin not found', 404);
  }
  return admin;
};

module.exports = {
  loginAdmin,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateContact,
  getAdminProfile,
};
