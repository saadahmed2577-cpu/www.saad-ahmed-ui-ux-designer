import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'saad_portfolio_super_secure_jwt_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    username: string;
    role: string;
  };
}

export const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid token format. Please log in as Admin.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired token. Please log in again.',
    });
  }
};
