const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const portfolioRoutes = require('./portfolioRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Personal Portfolio API (Node.js + MongoDB Atlas)',
  });
});

module.exports = router;
