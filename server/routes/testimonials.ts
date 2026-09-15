import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';
import { Testimonial } from '../../src/types';

const router = express.Router();

/**
 * GET /api/testimonials
 * Public: Get approved testimonials
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const currentDb = db.load();
    return res.json({
      success: true,
      count: currentDb.testimonials.length,
      data: currentDb.testimonials,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve testimonials.',
    });
  }
});

/**
 * POST /api/testimonials
 * Public or Protected: Add a testimonial / review
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, role, company, content, rating, avatar } = req.body || {};

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "name" and "content" are required.',
      });
    }

    const newTestimonial: Testimonial = {
      id: req.body.id || `test-${Date.now()}`,
      name: String(name).trim(),
      role: String(role || 'Client').trim(),
      company: String(company || 'Collaborator').trim(),
      content: String(content).trim(),
      rating: Number(rating) || 5,
      avatar: avatar || undefined,
    };

    const currentDb = db.load();
    currentDb.testimonials.unshift(newTestimonial);
    db.save(currentDb);

    return res.status(201).json({
      success: true,
      message: 'Testimonial added to database.',
      data: newTestimonial,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to save testimonial.',
    });
  }
});

/**
 * DELETE /api/testimonials/:id
 * Protected: Delete testimonial
 */
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();

    const initialLen = currentDb.testimonials.length;
    currentDb.testimonials = currentDb.testimonials.filter((t) => t.id !== id);

    if (currentDb.testimonials.length === initialLen) {
      return res.status(404).json({
        success: false,
        error: `Testimonial "${id}" not found.`,
      });
    }

    db.save(currentDb);

    return res.json({
      success: true,
      message: 'Testimonial deleted.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete testimonial.',
    });
  }
});

export default router;
