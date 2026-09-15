import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Routes
import authRouter, { initAdminCredentials } from './server/routes/auth';
import projectsRouter from './server/routes/projects';
import skillsRouter from './server/routes/skills';
import experienceRouter from './server/routes/experience';
import aboutRouter from './server/routes/about';
import contactRouter from './server/routes/contact';
import testimonialsRouter from './server/routes/testimonials';
import uploadRouter from './server/routes/upload';
import docsRouter from './server/routes/docs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB and admin credentials
  await initAdminCredentials();

  // Basic CORS headers for external client flexibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Body parser with 25MB limit for rich content and base64 fallbacks
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static uploads directory for media files & resumes
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Saad Ahmed Portfolio Backend',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/skills', skillsRouter);
  app.use('/api/experience', experienceRouter);
  app.use('/api/about', aboutRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/testimonials', testimonialsRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/docs', docsRouter);

  // Backward compatibility legacy routes for existing frontend modals
  app.get('/api/inquiries', (req, res, next) => {
    // Forward internally to /api/contact/messages with no auth restriction if local admin
    contactRouter(req, res, next);
  });
  app.get('/api/reviews', (req, res, next) => {
    testimonialsRouter(req, res, next);
  });
  app.post('/api/reviews', (req, res, next) => {
    testimonialsRouter(req, res, next);
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
    console.log(`🚀 Portfolio Backend running on http://0.0.0.0:${PORT}`);
    console.log(`📖 API Documentation available at http://0.0.0.0:${PORT}/api/docs`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
