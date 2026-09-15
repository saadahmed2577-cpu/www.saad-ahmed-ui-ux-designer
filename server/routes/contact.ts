import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';
import { InquiryMessage } from '../db/database';

const router = express.Router();

/**
 * POST /api/contact
 * Public: Contact form submission with input validation
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, service, message } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "name" is required.',
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: A valid "email" address is required.',
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "message" cannot be empty.',
      });
    }

    const newInquiry: InquiryMessage = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      service: service ? String(service).trim() : 'UI/UX Design',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const currentDb = db.load();
    currentDb.inquiries.unshift(newInquiry);
    db.save(currentDb);

    console.log(`\n📬 [NEW PORTFOLIO MESSAGE] From: ${newInquiry.name} <${newInquiry.email}> | Service: ${newInquiry.service}\n`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been safely delivered to Saad Ahmed.',
      data: newInquiry,
    });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message submission.',
    });
  }
});

/**
 * GET /api/contact/messages
 * Protected: Fetch all received inquiries for Admin Dashboard
 */
router.get('/messages', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const currentDb = db.load();
    return res.json({
      success: true,
      count: currentDb.inquiries.length,
      data: currentDb.inquiries,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages.',
    });
  }
});

/**
 * DELETE /api/contact/messages/:id
 * Protected: Delete an inquiry message
 */
router.delete('/messages/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();

    const initialLen = currentDb.inquiries.length;
    currentDb.inquiries = currentDb.inquiries.filter((m) => m.id !== id);

    if (currentDb.inquiries.length === initialLen) {
      return res.status(404).json({
        success: false,
        error: `Message "${id}" not found.`,
      });
    }

    db.save(currentDb);

    return res.json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete message.',
    });
  }
});

export default router;
