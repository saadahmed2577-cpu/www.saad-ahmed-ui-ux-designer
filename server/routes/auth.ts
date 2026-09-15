import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export default router;
