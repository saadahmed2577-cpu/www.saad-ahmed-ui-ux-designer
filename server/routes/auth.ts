import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { db } from '../db/database';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'saad_portfolio_super_secure_jwt_secret_key_2026';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'UI/UXSAQ';

// Initialize default admin password if empty
export const initAdminCredentials = async () => {
  const currentDb = db.load();
  if (!currentDb.admin.passwordHash) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, salt);
    currentDb.admin = {
      username: 'saad_admin',
      passwordHash: hash,
      updatedAt: new Date().toISOString(),
    };
    db.save(currentDb);
    console.log('✅ Admin credentials initialized with default password.');
  }
};

/**
 * POST /api/auth/login
 * Body: { password, username? }
 * Returns: { success: true, token, user }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { password, username } = req.body || {};

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required to log into Admin CMS.',
      });
    }

    const currentDb = db.load();
    const storedHash = currentDb.admin.passwordHash;

    let isMatch = false;

    // Check against bcrypt hash
    if (storedHash) {
      isMatch = await bcrypt.compare(String(password), storedHash);
    }

    // Fallback: If not matched or unhashed, check if direct match with DEFAULT_PASSWORD
    if (!isMatch && (password === DEFAULT_PASSWORD || password === 'UI/UXSAQ')) {
      isMatch = true;
      // Upgrade to hashed
      const salt = await bcrypt.genSalt(10);
      currentDb.admin.passwordHash = await bcrypt.hash(String(password), salt);
      db.save(currentDb);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Access denied.',
      });
    }

    const payload = {
      username: username || currentDb.admin.username || 'saad_admin',
      role: 'admin',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Authentication successful. Welcome, Saad.',
      token,
      user: {
        username: payload.username,
        role: payload.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication.',
    });
  }
});

/**
 * GET /api/auth/verify
 * Checks if current Bearer token is valid
 */
router.get('/verify', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    message: 'Token is valid.',
    user: req.adminUser,
  });
});

/**
 * POST /api/auth/change-password
 * Requires Bearer Token
 * Body: { currentPassword, newPassword }
 */
router.post('/change-password', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Both current password and new password are required.',
      });
    }

    if (String(newPassword).length < 4) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 4 characters long.',
      });
    }

    const currentDb = db.load();
    const isCurrentValid = await bcrypt.compare(
      String(currentPassword),
      currentDb.admin.passwordHash
    );

    if (!isCurrentValid && currentPassword !== DEFAULT_PASSWORD) {
      return res.status(400).json({
        success: false,
        error: 'Current password does not match.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(String(newPassword), salt);

    currentDb.admin.passwordHash = newHash;
    currentDb.admin.updatedAt = new Date().toISOString();
    db.save(currentDb);

    return res.json({
      success: true,
      message: 'Password changed successfully. Please keep it safe.',
    });
  } catch (err: any) {
    console.error('Password change error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update password.',
    });
  }
});

// In-memory OTP storage for forgot password
interface StoredOtp {
  code: string;
  expiresAt: number;
  email: string;
  phone: string;
  verified: boolean;
}

let activeOtp: StoredOtp | null = null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'saadahmed3803@gmail.com';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+92 345 8273354';

/**
 * Sends OTP via Gmail/SMTP if GMAIL_APP_PASSWORD is set
 */
async function sendOtpEmail(toEmail: string, otp: string): Promise<{ delivered: boolean; info?: string }> {
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
  if (!gmailPass) {
    console.log(`ℹ️ [Email Dispatch] GMAIL_APP_PASSWORD not set in env. Simulating email dispatch to ${toEmail}.`);
    return { delivered: false, info: 'Pending Gmail App Password in .env' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ADMIN_EMAIL,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `"Saad Ahmed Portfolio Security" <${ADMIN_EMAIL}>`,
      to: toEmail,
      subject: `🔐 Your Portfolio CMS Password Reset OTP: ${otp}`,
      text: `Hello Saad,\n\nYour 6-digit verification code to reset your Portfolio CMS password is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nPortfolio Security System`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0b0b0d; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #222;">
          <h2 style="color: #D91E2A; margin-top: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">CMS Security Protocol</h2>
          <p style="color: #9A9A9A; font-size: 14px;">You requested a password reset for your portfolio administration panel.</p>
          <div style="background: #151518; border: 1px solid #333; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">6-Digit Verification Code</span>
            <strong style="font-size: 34px; letter-spacing: 6px; color: #ffffff; font-family: monospace;">${otp}</strong>
          </div>
          <p style="color: #666; font-size: 12px;">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</p>
        </div>
      `,
    });

    console.log(`✅ [Email Dispatch] OTP email successfully sent to ${toEmail}`);
    return { delivered: true };
  } catch (err: any) {
    console.error(`⚠️ [Email Dispatch Error] Failed to send email via nodemailer:`, err.message);
    return { delivered: false, info: err.message };
  }
}

/**
 * Sends SMS via Twilio if TWILIO credentials are set
 */
async function sendOtpSms(toPhone: string, otp: string): Promise<{ delivered: boolean; info?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioNumber) {
    console.log(`ℹ️ [SMS Dispatch] Twilio credentials not provided yet (will be active once added). SMS skipped.`);
    return { delivered: false, info: 'Twilio credentials not set in env' };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', toPhone);
    params.append('From', twilioNumber);
    params.append('Body', `Your Portfolio CMS Password Reset OTP is: ${otp}. Valid for 10 minutes.`);

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`⚠️ [SMS Dispatch Error] Twilio responded with:`, errorText);
      return { delivered: false, info: errorText };
    }

    console.log(`✅ [SMS Dispatch] Twilio SMS successfully delivered to ${toPhone}`);
    return { delivered: true };
  } catch (err: any) {
    console.error(`⚠️ [SMS Dispatch Error]:`, err.message);
    return { delivered: false, info: err.message };
  }
}

/**
 * POST /api/auth/forgot-password
 * Triggers an OTP to saadahmed3803@gmail.com and +92 345 8273354
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    // Validate identity or default to registered admin
    const emailTarget = ADMIN_EMAIL;
    const phoneTarget = ADMIN_PHONE;

    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtp = {
      code: generatedOtp,
      expiresAt,
      email: emailTarget,
      phone: phoneTarget,
      verified: false,
    };

    console.log('----------------------------------------------------');
    console.log(`🔐 [ADMIN FORGOT PASSWORD OTP GENERATED]`);
    console.log(`📧 Target Email: ${emailTarget}`);
    console.log(`📱 Target Phone: ${phoneTarget}`);
    console.log(`🔑 Verification OTP: ${generatedOtp}`);
    console.log(`⏳ Valid For: 10 minutes (expires at ${new Date(expiresAt).toLocaleTimeString()})`);
    console.log('----------------------------------------------------');

    // Trigger dispatch asynchronously without blocking the user
    const [emailResult, smsResult] = await Promise.all([
      sendOtpEmail(emailTarget, generatedOtp),
      sendOtpSms(phoneTarget, generatedOtp),
    ]);

    return res.json({
      success: true,
      message: `Verification OTP has been dispatched to ${emailTarget}. Valid for 10 minutes.`,
      email: emailTarget,
      phone: phoneTarget,
      expiresInMinutes: 10,
      emailDelivered: emailResult.delivered,
      smsDelivered: smsResult.delivered,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate password reset OTP.',
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { otp }
 */
router.post('/verify-otp', (req: Request, res: Response) => {
  try {
    const { otp } = req.body || {};

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'Please enter the 6-digit OTP.',
      });
    }

    if (!activeOtp) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP request found. Please request a new OTP first.',
      });
    }

    if (Date.now() > activeOtp.expiresAt) {
      activeOtp = null;
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.',
      });
    }

    if (activeOtp.code !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP code. Please check and try again.',
      });
    }

    activeOtp.verified = true;

    return res.json({
      success: true,
      message: 'OTP verified successfully. You can now set your new password.',
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify OTP.',
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Body: { otp, newPassword }
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { otp, newPassword } = req.body || {};

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Both OTP code and new password are required.',
      });
    }

    if (String(newPassword).length < 4) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 4 characters long.',
      });
    }

    if (!activeOtp) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP request found. Please start by requesting an OTP.',
      });
    }

    if (Date.now() > activeOtp.expiresAt) {
      activeOtp = null;
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.',
      });
    }

    if (activeOtp.code !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP code.',
      });
    }

    const currentDb = db.load();
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(String(newPassword), salt);

    currentDb.admin.passwordHash = newHash;
    currentDb.admin.updatedAt = new Date().toISOString();
    db.save(currentDb);

    // Invalidate active OTP
    activeOtp = null;

    console.log('✅ Admin password successfully reset with verified OTP.');

    return res.json({
      success: true,
      message: 'Admin password has been reset successfully. You can now login with your new password.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password.',
    });
  }
});

export default router;
