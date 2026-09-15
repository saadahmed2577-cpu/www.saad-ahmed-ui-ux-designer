# Saad Ahmed — Personal Portfolio Backend System 🚀

This is the full production backend system for **Saad Ahmed's Personal Portfolio & CMS**. Built with **Node.js, Express.js, TypeScript, REST API architecture, JWT Authentication, and Persistent Database Storage**.

---

## 🏗️ 1. Architecture & Tech Stack

- **Backend Runtime**: Node.js + Express.js + TypeScript (`tsx`)
- **Database Architecture**: Persistent Single-Source-of-Truth JSON Database (`database.json`) with automated atomic writes, automatic initialization, and zero cold-start delay.
  - *Why this choice?* Unlike external MongoDB instances that require separate connection strings, network whitelisting, and monthly cloud charges, this local persistent JSON engine runs natively, boots instantly in containerized environments (Cloud Run / Docker), and preserves full ACID guarantees with atomic file locking. If MongoDB is required later, the controller structure cleanly maps 1:1 to Mongoose models.
- **Security & Authentication**:
  - JWT (JSON Web Tokens) with 7-day expiration (`Authorization: Bearer <token>`)
  - Password hashing with **bcryptjs** (salt rounds: 10)
  - Protected Admin endpoints (`/api/projects`, `/api/skills`, `/api/experience`, `/api/about`, `/api/contact/messages`, `/api/upload`)
- **File Uploads**:
  - **Multer** storage engine targeting `/uploads` with 15MB file size limit, sanitized filenames, and MIME-type validation (Images: JPEG, PNG, WEBP, GIF, SVG, Resumes: PDF).
- **CORS & Headers**: Enabled for cross-origin frontend clients and mobile apps.

---

## 📂 2. Backend Directory Structure

```text
├── server.ts                       # Main Express server entry point & middleware orchestrator
├── database.json                   # Real-time persistent portfolio database file
├── uploads/                        # Stored project screenshots, covers, and resumes
├── server/
│   ├── db/
│   │   └── database.ts             # Storage engine, models, schemas & seed data
│   ├── middleware/
│   │   ├── auth.ts                 # JWT Bearer verification middleware (requireAdminAuth)
│   │   └── upload.ts               # Multer disk storage and file filter middleware
│   └── routes/
│       ├── auth.ts                 # /api/auth (Login, Verify, Change Password)
│       ├── projects.ts             # /api/projects (CRUD: Create, Read, Update, Delete)
│       ├── skills.ts               # /api/skills (Add, Update, Delete skills)
│       ├── experience.ts           # /api/experience (Timeline management)
│       ├── about.ts                # /api/about (Bio, links, resume URL)
│       ├── contact.ts              # /api/contact (Public form submit & Admin inbox)
│       ├── testimonials.ts         # /api/testimonials (Client reviews & testimonials)
│       ├── upload.ts               # /api/upload (Multipart form image & resume uploader)
│       └── docs.ts                 # /api/docs (Auto-generated interactive API documentation)
└── src/
    └── services/
        └── api.ts                  # Frontend API service connecting UI to backend
```

---

## 🔐 3. Default Admin Credentials

- **Admin Username**: `saad_admin`
- **Default Password**: `UI/UXSAQ`
- **Password Upgrade**: On first login, bcrypt automatically hashes the password and stores the salt in `database.json`.
- **Change Password**: Saad can change the password at any time directly through the CMS Admin Modal using `POST /api/auth/change-password`.

---

## 📡 4. Complete REST API Endpoints Specification

### 🔑 Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Submit `{ password }` to receive JWT token. |
| `GET` | `/api/auth/verify` | Bearer Token | Validate current JWT session. |
| `POST` | `/api/auth/change-password` | Bearer Token | Submit `{ currentPassword, newPassword }` to update password with bcrypt. |

### 📁 Projects (CRUD)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Public | Fetch all projects. Filters: `?category=...&featured=true&search=...` |
| `GET` | `/api/projects/:id` | Public | Fetch single project by ID or slug. |
| `POST` | `/api/projects` | Bearer Token | Create new project in database (instantly visible on portfolio). |
| `PUT` | `/api/projects/:id` | Bearer Token | Update project details, images, or links. |
| `DELETE` | `/api/projects/:id` | Bearer Token | Delete project permanently from database. |

### 🛠️ Skills & Experience
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/skills` | Public | Fetch list of design & software skills. |
| `POST` | `/api/skills` | Bearer Token | Add or update a skill `{ name, percentage, category }`. |
| `DELETE` | `/api/skills/:name` | Bearer Token | Remove a skill by name. |
| `GET` | `/api/experience` | Public | Fetch career timeline and certifications. |
| `POST` | `/api/experience` | Bearer Token | Add new role/experience `{ company, role, period, description }`. |
| `PUT` | `/api/experience/:id`| Bearer Token | Edit experience entry. |
| `DELETE` | `/api/experience/:id`| Bearer Token | Remove experience entry. |

### 👤 About & Contact Form
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/about` | Public | Get bio, location, contact links, resume URL. |
| `PUT` | `/api/about` | Bearer Token | Update about info. |
| `POST` | `/api/contact` | Public | Submit contact inquiry from portfolio visitor. |
| `GET` | `/api/contact/messages` | Bearer Token | Admin inbox to view received client messages. |
| `DELETE` | `/api/contact/messages/:id` | Bearer Token | Delete client inquiry. |

### 🖼️ File Upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/upload` | Bearer Token | Upload image or PDF resume via `multipart/form-data` with field `file`. Returns `{ url: '/uploads/...' }`. |

### 📖 Interactive Docs
- Access `http://localhost:3000/api/docs` to view dynamic JSON API documentation.

---

## ⚡ 5. Real-Time Synchronization Flow

1. When Saad creates or edits a project in the CMS, the frontend immediately sends `POST /api/projects` or `PUT /api/projects/:id` with the JWT token in headers.
2. The server validates input, persists the new record atomically to `database.json`, and returns the created/updated model.
3. The React frontend updates its local state in real-time, instantly displaying the new project in the portfolio grid without requiring a manual page refresh.
4. When a user submits the Contact Form, `POST /api/contact` saves the message to the database and logs it with a formatted notification in the server console, simultaneously making it available in Saad's Admin Inbox.

---

## 🚀 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run both Backend Server & Vite in unified dev mode
npm run dev

# The app and API will be live at:
# Frontend & API: http://localhost:3000
# API Documentation: http://localhost:3000/api/docs
```
