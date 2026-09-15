const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 2. CORS Configuration
const allowedOrigins = env.CLIENT_URL === '*' ? '*' : [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Request Logger (Development)
if (env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// 5. Connect Database
connectDB();

// 6. Mount API Routes under /api
app.use('/api', routes);

// 7. 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} does not exist on this server.`,
  });
});

// 8. Centralized Error Handler Middleware
app.use(errorHandler);

// 9. Start Server
const server = app.listen(env.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 [Portfolio Backend] Running in ${env.NODE_ENV} mode`);
  console.log(`📡 [Server Listening] http://localhost:${env.PORT}`);
  console.log(`🔗 [API Endpoints] http://localhost:${env.PORT}/api/portfolio`);
  console.log(`🔐 [Auth Endpoints] http://localhost:${env.PORT}/api/auth/login`);
  console.log('====================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 [Unhandled Rejection]:', err.message);
});

module.exports = app;
