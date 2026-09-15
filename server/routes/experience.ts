import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';
import { ExperienceItem } from '../../src/types';

const router = express.Router();

/**
 * GET /api/experience
 * Public: Fetch work experience & education timeline
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const currentDb = db.load();
    return res.json({
      success: true,
      count: currentDb.experience.length,
      data: currentDb.experience,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experience items.',
    });
  }
});

/**
 * POST /api/experience
 * Protected: Add experience item
 */
router.post('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { company, role, period, description, achievements } = req.body || {};

    if (!company || !role || !description) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: company, role, and description are required.',
      });
    }

    const newItem: ExperienceItem = {
      id: req.body.id || `exp-${Date.now()}`,
      company: String(company).trim(),
      role: String(role).trim(),
      period: String(period || 'Recent').trim(),
      description: String(description).trim(),
      achievements: Array.isArray(achievements) ? achievements : [],
    };

    const currentDb = db.load();
    currentDb.experience.unshift(newItem);
    db.save(currentDb);

    return res.status(201).json({
      success: true,
      message: 'Experience item added successfully.',
      data: newItem,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to add experience item.',
    });
  }
});

/**
 * PUT /api/experience/:id
 * Protected: Edit experience item
 */
router.put('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();
    const index = currentDb.experience.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Experience item "${id}" not found.`,
      });
    }

    currentDb.experience[index] = {
      ...currentDb.experience[index],
      ...req.body,
      id,
    };
    db.save(currentDb);

    return res.json({
      success: true,
      message: 'Experience updated successfully.',
      data: currentDb.experience[index],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update experience item.',
    });
  }
});

/**
 * DELETE /api/experience/:id
 * Protected: Delete experience item
 */
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();

    const initialLen = currentDb.experience.length;
    currentDb.experience = currentDb.experience.filter((e) => e.id !== id);

    if (currentDb.experience.length === initialLen) {
      return res.status(404).json({
        success: false,
        error: `Experience item "${id}" not found.`,
      });
    }

    db.save(currentDb);

    return res.json({
      success: true,
      message: `Experience item "${id}" removed.`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete experience item.',
    });
  }
});

export default router;
