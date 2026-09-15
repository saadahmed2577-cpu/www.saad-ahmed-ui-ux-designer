const express = require('express');
const router = express.Router();
const multer = require('multer');
const portfolioController = require('../controllers/portfolioController');
const { protectAdmin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createPortfolioRules,
  updatePortfolioRules,
  portfolioIdRule,
} = require('../validators/portfolioValidator');

// In-memory multer storage for streaming directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed'), false);
    }
  },
});

// 1. GET /api/portfolio (Public) - fetch all items, newest first
router.get('/', portfolioController.getAllItems);

// 2. GET /api/portfolio/:id (Public) - fetch single item
router.get('/:id', portfolioIdRule, validateRequest, portfolioController.getItemById);

// 3. POST /api/portfolio (Admin only) - create new item
router.post(
  '/',
  protectAdmin,
  upload.single('image'),
  createPortfolioRules,
  validateRequest,
  portfolioController.createItem
);

// 4. PUT /api/portfolio/:id (Admin only) - update item
router.put(
  '/:id',
  protectAdmin,
  upload.single('image'),
  updatePortfolioRules,
  validateRequest,
  portfolioController.updateItem
);

// 5. DELETE /api/portfolio/:id (Admin only) - delete item
router.delete(
  '/:id',
  protectAdmin,
  portfolioIdRule,
  validateRequest,
  portfolioController.deleteItem
);

module.exports = router;
