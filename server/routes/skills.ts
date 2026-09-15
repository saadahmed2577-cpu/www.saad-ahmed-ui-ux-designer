import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';
import { Skill } from '../../src/types';

const router = express.Router();

/**
 * GET /api/skills
 * Public: Fetch all skills grouped or flat
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const currentDb = db.load();
    return res.json({
      success: true,
      count: currentDb.skills.length,
      data: currentDb.skills,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve skills.',
    });
  }
});

/**
 * POST /api/skills
 * Protected: Add new skill
 */
router.post('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, percentage, category } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Skill name is required.',
      });
    }

    const pct = Number(percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      return res.status(400).json({
        success: false,
        error: 'Skill percentage must be a number between 0 and 100.',
      });
    }

    const newSkill: Skill = {
      name: name.trim(),
      percentage: pct,
      category: category || 'Core',
    };

    const currentDb = db.load();
    // If already exists, update it, else add
    const index = currentDb.skills.findIndex(
      (s) => s.name.toLowerCase() === newSkill.name.toLowerCase()
    );

    if (index >= 0) {
      currentDb.skills[index] = newSkill;
    } else {
      currentDb.skills.push(newSkill);
    }

    db.save(currentDb);

    return res.status(201).json({
      success: true,
      message: `Skill "${newSkill.name}" saved successfully.`,
      data: newSkill,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to save skill.',
    });
  }
});

/**
 * PUT /api/skills
 * Protected: Batch update or replace full skills list
 */
router.put('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { skills } = req.body || {};

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        error: 'Expected "skills" to be an array of skill objects.',
      });
    }

    const currentDb = db.load();
    currentDb.skills = skills;
    db.save(currentDb);

    return res.json({
      success: true,
      message: 'Skills updated successfully.',
      count: currentDb.skills.length,
      data: currentDb.skills,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update skills.',
    });
  }
});

/**
 * DELETE /api/skills/:name
 * Protected: Delete a skill by name
 */
router.delete('/:name', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const currentDb = db.load();

    const initialLen = currentDb.skills.length;
    currentDb.skills = currentDb.skills.filter(
      (s) => s.name.toLowerCase() !== decodeURIComponent(name).toLowerCase()
    );

    if (currentDb.skills.length === initialLen) {
      return res.status(404).json({
        success: false,
        error: `Skill "${name}" not found.`,
      });
    }

    db.save(currentDb);

    return res.json({
      success: true,
      message: `Skill "${name}" deleted successfully.`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete skill.',
    });
  }
});

export default router;
