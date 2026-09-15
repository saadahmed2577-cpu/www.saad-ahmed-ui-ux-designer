const { validationResult } = require('express-validator');

/**
 * Middleware that inspects express-validator results.
 * If validation errors exist, formats them and halts the request with HTTP 422.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      error: 'Validation failed. Please check the submitted fields.',
      validationErrors: formattedErrors,
    });
  }

  next();
};

module.exports = validateRequest;
