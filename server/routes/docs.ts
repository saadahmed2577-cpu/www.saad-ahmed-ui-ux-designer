import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * GET /api/docs
 * Interactive JSON API documentation overview
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Saad Ahmed Portfolio Backend API',
    version: '2.0.0',
    description: 'RESTful API for personal portfolio with real-time JSON database persistence, JWT authentication, and file upload support.',
    baseUrl: '/api',
    auth: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      loginEndpoint: 'POST /api/auth/login',
    },
    endpoints: [
      {
        path: '/api/auth/login',
        method: 'POST',
        authRequired: false,
        description: 'Login with admin password to obtain JWT token.',
        body: { password: 'UI/UXSAQ' },
      },
      {
        path: '/api/auth/verify',
        method: 'GET',
        authRequired: true,
        description: 'Verify current JWT token session.',
      },
      {
        path: '/api/auth/change-password',
        method: 'POST',
        authRequired: true,
        description: 'Update admin password with bcrypt hashing.',
      },
      {
        path: '/api/projects',
        method: 'GET',
        authRequired: false,
        description: 'Fetch all projects. Supports query params: ?category=...&featured=true&search=...',
      },
      {
        path: '/api/projects/:id',
        method: 'GET',
        authRequired: false,
        description: 'Fetch single project by unique slug or ID.',
      },
      {
        path: '/api/projects',
        method: 'POST',
        authRequired: true,
        description: 'Create new project in database.',
      },
      {
        path: '/api/projects/:id',
        method: 'PUT',
        authRequired: true,
        description: 'Update existing project by ID.',
      },
      {
        path: '/api/projects/:id',
        method: 'DELETE',
        authRequired: true,
        description: 'Delete project permanently from database.',
      },
      {
        path: '/api/skills',
        method: 'GET',
        authRequired: false,
        description: 'Fetch all design & tech skills.',
      },
      {
        path: '/api/skills',
        method: 'POST',
        authRequired: true,
        description: 'Add or update a skill.',
      },
      {
        path: '/api/skills/:name',
        method: 'DELETE',
        authRequired: true,
        description: 'Remove a skill by name.',
      },
      {
        path: '/api/experience',
        method: 'GET',
        authRequired: false,
        description: 'Fetch work experience & education history.',
      },
      {
        path: '/api/experience',
        method: 'POST',
        authRequired: true,
        description: 'Add new experience entry.',
      },
      {
        path: '/api/experience/:id',
        method: 'PUT',
        authRequired: true,
        description: 'Update experience entry.',
      },
      {
        path: '/api/experience/:id',
        method: 'DELETE',
        authRequired: true,
        description: 'Delete experience item.',
      },
      {
        path: '/api/about',
        method: 'GET',
        authRequired: false,
        description: 'Fetch About Me profile details.',
      },
      {
        path: '/api/about',
        method: 'PUT',
        authRequired: true,
        description: 'Update About Me bio, location, links, or resume.',
      },
      {
        path: '/api/contact',
        method: 'POST',
        authRequired: false,
        description: 'Submit contact message from public portfolio.',
      },
      {
        path: '/api/contact/messages',
        method: 'GET',
        authRequired: true,
        description: 'Get all received client inquiries for Admin Dashboard.',
      },
      {
        path: '/api/contact/messages/:id',
        method: 'DELETE',
        authRequired: true,
        description: 'Delete client message.',
      },
      {
        path: '/api/testimonials',
        method: 'GET',
        authRequired: false,
        description: 'Fetch client testimonials and reviews.',
      },
      {
        path: '/api/testimonials',
        method: 'POST',
        authRequired: false,
        description: 'Submit client review or add testimonial.',
      },
      {
        path: '/api/upload',
        method: 'POST',
        authRequired: true,
        description: 'Upload project screenshots, cover images, or resume PDF (form-data key: file).',
      },
    ],
  });
});

export default router;
