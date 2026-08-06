import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Persistent File Storage Paths
  const REVIEWS_FILE = path.join(process.cwd(), 'server_reviews.json');
  const INQUIRIES_FILE = path.join(process.cwd(), 'server_inquiries.json');

  // Load Reviews from Disk
  const loadReviewsFromDisk = () => {
    try {
      if (fs.existsSync(REVIEWS_FILE)) {
        const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading reviews from disk:', e);
    }
    return [];
  };

  // Save Reviews to Disk
  const saveReviewsToDisk = (reviews: any[]) => {
    try {
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    } catch (e) {
      console.error('Error saving reviews to disk:', e);
    }
  };

  // Load Inquiries from Disk
  const loadInquiriesFromDisk = () => {
    try {
      if (fs.existsSync(INQUIRIES_FILE)) {
        const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading inquiries from disk:', e);
    }
    return [];
  };

  // Save Inquiries to Disk
  const saveInquiriesToDisk = (inquiries: any[]) => {
    try {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    } catch (e) {
      console.error('Error saving inquiries to disk:', e);
    }
  };

  let inquiriesList: Array<{
    id: string;
    name: string;
    email: string;
    service: string;
    message: string;
    timestamp: string;
  }> = loadInquiriesFromDisk();

  let customReviewsList: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    timestamp?: string;
  }> = loadReviewsFromDisk();

  // Submit a Review/Comment API Endpoint
  app.post('/api/reviews', (req, res) => {
    const { id, name, role, company, content, rating } = req.body || {};

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name and content are required.'
      });
    }

    const reviewId = id || `custom-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newReview = {
      id: reviewId,
      name: String(name).trim(),
      role: String(role || 'Client').trim(),
      company: String(company || 'Collaborator').trim(),
      content: String(content).trim(),
      rating: Number(rating) || 5,
      timestamp: new Date().toISOString()
    };

    customReviewsList = customReviewsList.filter(r => r.id !== reviewId);
    customReviewsList.unshift(newReview);
    saveReviewsToDisk(customReviewsList);

    // Also auto-add as an inquiry for the Admin Inbox
    const reviewInquiry = {
      id: `inq_review_${Date.now()}`,
      name: String(name).trim(),
      email: 'Client Review Submission',
      service: `⭐ ${Number(rating) || 5}-Star Review`,
      message: `Role: ${String(role || 'Client')} @ ${String(company || 'Collaborator')}\n\nReview:\n"${String(content).trim()}"`,
      timestamp: new Date().toISOString()
    };
    inquiriesList.unshift(reviewInquiry);
    saveInquiriesToDisk(inquiriesList);

    console.log(`NEW CLIENT REVIEW RECEIVED & SAVED PERMANENTLY: ${newReview.name}`);

    return res.json({
      success: true,
      message: 'Review stored permanently on server.',
      data: newReview
    });
  });

  // Get all reviews
  app.get('/api/reviews', (_req, res) => {
    res.json({
      success: true,
      count: customReviewsList.length,
      reviews: customReviewsList
    });
  });

  // Delete review by ID or clear
  app.delete('/api/reviews', (req, res) => {
    const { id } = req.query;
    if (id) {
      customReviewsList = customReviewsList.filter(item => item.id !== id);
    } else {
      customReviewsList = [];
    }
    saveReviewsToDisk(customReviewsList);
    res.json({ success: true, reviews: customReviewsList });
  });

  // Contact Form Auto-Send API Endpoint
  app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required.'
      });
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      service: String(service || 'UI/UX Design').trim(),
      message: String(message).trim(),
      timestamp: new Date().toISOString()
    };

    inquiriesList.unshift(newInquiry);
    saveInquiriesToDisk(inquiriesList);

    const logEntry = `
==================================================
NEW PORTFOLIO INQUIRY FOR SAAD AHMED
==================================================
📌 Name: ${newInquiry.name}
✉️ Email: ${newInquiry.email}
🎨 Service: ${newInquiry.service}
📅 Date: ${new Date(newInquiry.timestamp).toLocaleString()}

📝 Message:
${newInquiry.message}
==================================================
`;

    console.log(logEntry);

    return res.json({
      success: true,
      message: 'Inquiry received privately and stored safely.',
      data: newInquiry
    });
  });

  // Get all private inquiries (For Saad's CMS Admin Inbox)
  app.get('/api/inquiries', (_req, res) => {
    res.json({
      success: true,
      count: inquiriesList.length,
      inquiries: inquiriesList
    });
  });

  // Delete an inquiry by ID or clear all
  app.delete('/api/inquiries', (req, res) => {
    const { id } = req.query;
    if (id) {
      inquiriesList = inquiriesList.filter(item => item.id !== id);
    } else {
      inquiriesList = [];
    }
    saveInquiriesToDisk(inquiriesList);
    res.json({ success: true, inquiries: inquiriesList });
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error launching Express server:', err);
});
