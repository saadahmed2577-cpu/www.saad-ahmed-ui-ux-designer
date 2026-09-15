# Production-Ready Portfolio Backend (Node.js + Express + MongoDB Atlas)

Complete, modular backend architecture for a personal portfolio website built with strict separation of concerns.

---

## 📁 Architecture & File Responsibilities

```
/backend
├── package.json              → Dependencies & npm scripts (start, dev, seed-admin)
├── .env.example              → Template for environment secrets (MongoDB, JWT, SMTP, Cloudinary)
├── server.js                 → Server entry point: boots DB, mounts middlewares, starts HTTP listener
├── app.js                    → Express application initialization & middleware pipeline
│
├── /config
│   ├── db.js                 → MongoDB connection with Mongoose, reconnection retry logic & event logs
│   ├── cloudinary.js         → Cloudinary v2 setup with fallback for direct URLs
│   └── env.js                → Centralized export of all environment variables with defaults
│
├── /models
│   ├── Admin.js              → Admin schema (email, bcrypt hashed password, role)
│   ├── Portfolio.js          → Portfolio item schema (title, description, techStack, imageUrl, URLs, category, date)
│   └── Otp.js                → 6-digit OTP schema with MongoDB TTL index (expires in 10 minutes)
│
├── /routes
│   ├── authRoutes.js         → /api/auth/* route definitions mapped to authController
│   ├── portfolioRoutes.js    → /api/portfolio/* route definitions mapped to portfolioController
│   └── index.js              → Combines and mounts all routers under /api
│
├── /controllers
│   ├── authController.js     → HTTP req/res handling only: calls authService, returns clean JSON
│   └── portfolioController.js→ HTTP req/res handling only: calls portfolioService, returns clean JSON
│
├── /services
│   ├── authService.js        → ALL auth business logic (bcrypt hashing, JWT, OTP generation/validation, MongoDB updates)
│   ├── portfolioService.js   → ALL portfolio CRUD logic, sorting, querying, Cloudinary buffer uploads
│   └── emailService.js       → Reusable Nodemailer generic SMTP transporter + sendEmail() function
│
├── /middleware
│   ├── authMiddleware.js     → Verifies JWT Bearer token, attaches req.admin, blocks unauthorized
│   ├── errorHandler.js       → Centralized error handling: catches Mongoose, JWT, and custom errors
│   ├── rateLimiter.js        → express-rate-limit protection on login and OTP request/verify endpoints
│   └── validateRequest.js   → Inspects express-validator results, returns HTTP 422 if invalid
│
├── /validators
│   ├── authValidator.js      → Validation chains for login, forgot-password, verify-otp, reset-password
│   └── portfolioValidator.js → Validation chains for portfolio CRUD and MongoDB ObjectIds
│
├── /utils
│   ├── generateOtp.js        → Cryptographically secure 6-digit OTP generator
│   └── asyncHandler.js       → Async wrapper to eliminate repetitive try/catch blocks in controllers
│
└── /scripts
    └── seedAdmin.js          → One-time script to create the initial admin account in MongoDB
```

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your details:
- **MONGO_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: Any long secret key
- **SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM**: Generic SMTP credentials (Gmail SMTP, Mailtrap, Brevo, SendGrid, etc.)

### 3. Seed Initial Admin Account
```bash
npm run seed-admin
```
This inserts your admin document into MongoDB with a bcrypt-hashed password.

### 4. Start the Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints Reference

### Public Endpoints:
- `GET /api/health` — Health check
- `GET /api/portfolio` — Fetch all portfolio projects (sorted newest first)
- `GET /api/portfolio/:id` — Fetch single project

### Authentication Endpoints:
- `POST /api/auth/login` — Login with email & password (Rate limited, returns JWT)
- `POST /api/auth/forgot-password` — Generates 6-digit OTP, sends via SMTP to email (Rate limited, expires in 10 min)
- `POST /api/auth/verify-otp` — Verifies 6-digit OTP (Rate limited)
- `POST /api/auth/reset-password` — Resets password with verified OTP

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`):
- `GET /api/auth/me` — Current admin profile
- `POST /api/auth/update-contact` — Update recovery email
- `POST /api/portfolio` — Add new project (supports image upload or direct `imageUrl`)
- `PUT /api/portfolio/:id` — Update project
- `DELETE /api/portfolio/:id` — Delete project
