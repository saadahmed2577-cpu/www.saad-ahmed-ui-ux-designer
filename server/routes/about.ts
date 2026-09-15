import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/about
 * Public: Get About me details, bio, contacts, and resume URL
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const currentDb = db.load();
    return res.json({
      success: true,
      data: currentDb.about,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve About information.',
    });
  }
});

/**
 * PUT /api/about
 * Protected: Update About information
 */
router.put('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const currentDb = db.load();

    currentDb.about = {
      ...currentDb.about,
      ...body,
    };
    db.save(currentDb);

    return res.json({
      success: true,
      message: 'About information updated successfully.',
      data: currentDb.about,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update About details.',
    });
  }
});

export default router;
