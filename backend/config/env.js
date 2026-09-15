require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_fallback_secret_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Admin initial setup
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'saad_admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'saadahmed3803@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'UI/UXSAQ',
  
  // Generic SMTP Configuration (Nodemailer)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || (process.env.SMTP_USER ? `"Portfolio Admin" <${process.env.SMTP_USER}>` : '"Portfolio Admin" <no-reply@portfolio.com>'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

module.exports = env;
