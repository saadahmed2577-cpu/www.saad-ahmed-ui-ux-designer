/**
 * Wraps an async express route handler to automatically catch errors
 * and forward them to Express centralized errorHandler middleware.
 * @param {Function} fn - Async controller function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
