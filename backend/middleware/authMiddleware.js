const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Bearer token missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin token is valid, but the admin account was not found in database.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authorization token.',
    });
  }
};

module.exports = {
  protectAdmin,
};
