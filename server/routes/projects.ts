import express, { Request, Response } from 'express';
import { db } from '../db/database';
import { requireAdminAuth } from '../middleware/auth';
import { Project } from '../../src/types';

const router = express.Router();

/**
 * GET /api/projects
 * Public: Fetch all projects with optional category and featured filters
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, featured, search } = req.query;
    const currentDb = db.load();
    let result = [...currentDb.projects];

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === 'true') {
      result = result.filter((p) => p.featured === true);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects.',
    });
  }
});

/**
 * GET /api/projects/:id
 * Public: Get single project by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();
    const project = currentDb.projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with ID "${id}" was not found.`,
      });
    }

    return res.json({
      success: true,
      data: project,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve project details.',
    });
  }
});

/**
 * POST /api/projects
 * Protected: Create a new project
 */
router.post('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { title, category, shortDescription, coverImage } = body;

    // Strict Input Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: "title" is required and cannot be empty.',
      });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: "category" is required.',
      });
    }

    if (!shortDescription || typeof shortDescription !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: "shortDescription" is required.',
      });
    }

    const currentDb = db.load();

    // Auto slug or unique ID
    const slugBase = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let newId = body.id || slugBase || `project-${Date.now()}`;

    // Ensure unique ID
    let counter = 1;
    while (currentDb.projects.some((p) => p.id === newId)) {
      newId = `${slugBase}-${counter++}`;
    }

    const newProject: Project = {
      id: newId,
      title: title.trim(),
      category: category as any,
      year: body.year || new Date().getFullYear().toString(),
      clientName: body.clientName?.trim() || 'Confidential Client',
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      galleryImages: Array.isArray(body.galleryImages) && body.galleryImages.length > 0
        ? body.galleryImages
        : [coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'],
      shortDescription: shortDescription.trim(),
      problemStatement: body.problemStatement?.trim() || 'Design problem statement and background overview.',
      research: body.research?.trim() || 'Qualitative discovery and user testing methodology.',
      designProcess: Array.isArray(body.designProcess) && body.designProcess.length > 0
        ? body.designProcess
        : [
            { phase: 'Research', description: 'User persona definition & competitive audit.' },
            { phase: 'UI Design', description: 'High fidelity UI screens with responsive design.' },
          ],
      wireframeImages: Array.isArray(body.wireframeImages) ? body.wireframeImages : [],
      uiScreens: Array.isArray(body.uiScreens) ? body.uiScreens : [],
      prototypeLink: body.prototypeLink || '',
      liveLink: body.liveLink || '',
      toolsUsed: Array.isArray(body.toolsUsed) && body.toolsUsed.length > 0 ? body.toolsUsed : ['Figma'],
      tags: Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : [category],
      featured: Boolean(body.featured),
      typography: body.typography || {
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        sampleText: title.trim(),
      },
      colorPalette: Array.isArray(body.colorPalette)
        ? body.colorPalette
        : [
            { name: 'Dark Velvet', hex: '#0A0A0A' },
            { name: 'Crimson Red', hex: '#D91E2A' },
            { name: 'Charcoal Layer', hex: '#161618' },
            { name: 'Clean White', hex: '#FFFFFF' },
          ],
    };

    // Add to beginning of array so it appears instantly at top
    currentDb.projects.unshift(newProject);
    db.save(currentDb);

    return res.status(201).json({
      success: true,
      message: 'Project created and saved to database successfully.',
      data: newProject,
    });
  } catch (err: any) {
    console.error('Error creating project:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create project in database.',
    });
  }
});

/**
 * PUT /api/projects/:id
 * Protected: Update existing project
 */
router.put('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const currentDb = db.load();

    const index = currentDb.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Project with ID "${id}" not found.`,
      });
    }

    const existing = currentDb.projects[index];

    const updatedProject: Project = {
      ...existing,
      ...body,
      id, // Preserve id
      title: body.title ? body.title.trim() : existing.title,
      category: body.category || existing.category,
      shortDescription: body.shortDescription ? body.shortDescription.trim() : existing.shortDescription,
    };

    currentDb.projects[index] = updatedProject;
    db.save(currentDb);

    return res.json({
      success: true,
      message: `Project "${updatedProject.title}" updated successfully in database.`,
      data: updatedProject,
    });
  } catch (err: any) {
    console.error('Error updating project:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update project.',
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Protected: Remove project from database
 */
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentDb = db.load();

    const exists = currentDb.projects.some((p) => p.id === id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: `Project with ID "${id}" does not exist in database.`,
      });
    }

    currentDb.projects = currentDb.projects.filter((p) => p.id !== id);
    db.save(currentDb);

    return res.json({
      success: true,
      message: `Project "${id}" permanently removed from database.`,
      remainingCount: currentDb.projects.length,
    });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete project.',
    });
  }
});

export default router;
