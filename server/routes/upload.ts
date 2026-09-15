import express, { Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { requireAdminAuth } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/upload
 * Protected: Upload images (screenshots, project covers) or resume PDF
 */
router.post(
  '/',
  requireAdminAuth,
  upload.single('file'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded. Please attach a file under key "file".',
        });
      }

      // Generate accessible relative URL
      const fileUrl = `/uploads/${req.file.filename}`;

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully.',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'File upload failed.',
      });
    }
  }
);

export default router;
