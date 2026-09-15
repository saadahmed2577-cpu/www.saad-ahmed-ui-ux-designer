const asyncHandler = require('../utils/asyncHandler');
const portfolioService = require('../services/portfolioService');

/**
 * 1. POST /api/portfolio (Admin only)
 */
const createItem = asyncHandler(async (req, res) => {
  const newItem = await portfolioService.createPortfolioItem(req.body, req.file);

  res.status(201).json({
    success: true,
    message: 'Portfolio project created successfully',
    data: newItem,
  });
});

/**
 * 2. GET /api/portfolio (Public)
 */
const getAllItems = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const items = await portfolioService.getAllPortfolioItems({ category, search });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

/**
 * 3. GET /api/portfolio/:id (Public)
 */
const getItemById = asyncHandler(async (req, res) => {
  const item = await portfolioService.getPortfolioItemById(req.params.id);

  res.status(200).json({
    success: true,
    data: item,
  });
});

/**
 * 4. PUT /api/portfolio/:id (Admin only)
 */
const updateItem = asyncHandler(async (req, res) => {
  const updatedItem = await portfolioService.updatePortfolioItem(req.params.id, req.body, req.file);

  res.status(200).json({
    success: true,
    message: 'Portfolio project updated successfully',
    data: updatedItem,
  });
});

/**
 * 5. DELETE /api/portfolio/:id (Admin only)
 */
const deleteItem = asyncHandler(async (req, res) => {
  const result = await portfolioService.deletePortfolioItem(req.params.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
