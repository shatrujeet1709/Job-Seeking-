# 🚀 AI-Powered Job Recommendation & Freelance Platform
## Full End-to-End Architecture + Agentic Build Instructions

---

> **Agent Instruction — READ FIRST**
>
> You are a senior full-stack engineer AI agent assigned to build this project from scratch, end to end.
> Follow each phase sequentially. Do NOT skip phases. At the end of each phase, verify all tests pass and
> the feature works before proceeding to the next phase. Log every decision. If a step fails, debug it
> before moving forward. Treat this document as your single source of truth.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema](#5-database-schema)
6. [API Contract](#6-api-contract)
7. [Phase 1 — Project Setup & Auth](#7-phase-1--project-setup--auth)
8. [Phase 2 — User Profile Builder](#8-phase-2--user-profile-builder)
9. [Phase 3 — Real-Time Job Feed](#9-phase-3--real-time-job-feed)
10. [Phase 4 — AI Recommendation Engine](#10-phase-4--ai-recommendation-engine)
11. [Phase 5 — Freelance Marketplace](#11-phase-5--freelance-marketplace)
12. [Phase 6 — Recruiter Dashboard](#12-phase-6--recruiter-dashboard)
13. [Phase 7 — UI/UX & Design System](#13-phase-7--uiux--design-system)
14. [Phase 8 — Testing](#14-phase-8--testing)
15. [Phase 9 — Deployment](#15-phase-9--deployment)
16. [Environment Variables Reference](#16-environment-variables-reference)
17. [Agentic Execution Checklist](#17-agentic-execution-checklist)

---

## 1. Project Overview

### What This Platform Does

This is a full-stack, AI-powered career platform that serves three types of users:

| User Type | What They Do |
|-----------|-------------|
| **Job Seeker** | Build profile with skills/degree → get AI-matched job suggestions from live data |
| **Recruiter** | Post jobs, browse AI-ranked candidate profiles, contact matches |
| **Freelancer** | List gig services, get matched to short-term projects, receive payments |

### Core Features

- **Smart Profile Builder** — Skills, education, experience, resume upload (PDF)
- **Live Job Feed** — Real-time jobs pulled from Adzuna, Remotive, and The Muse APIs
- **AI Job Matching** — Claude API reads user profile → ranks live jobs → explains fit
- **Recruiter Portal** — Post jobs, filter candidates by AI score, direct messaging
- **Freelance Marketplace** — Post gigs, browse projects, escrow-based payment
- **Real-Time Notifications** — Socket.io powered alerts for matches, messages, applications
- **Analytics Dashboard** — Profile views, application status, earnings tracking

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│                                                                       │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│   │  Job Seeker  │  │  Recruiter   │  │  Freelancer  │             │
│   │   Browser    │  │   Browser    │  │   Browser    │             │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│          └─────────────────┼─────────────────┘                      │
│                            │  HTTPS                                  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                     FRONTEND — React.js (Vercel)                     │
│                                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │   Auth   │ │ Profile  │ │  Jobs    │ │   AI     │ │Freelance │ │
│  │  Pages   │ │ Builder  │ │  Feed    │ │Dashboard │ │Marketplace│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                                       │
│  State: Redux Toolkit  │  Routing: React Router v6  │  UI: Tailwind │
└────────────────────────┬────────────────────────────────────────────┘
                         │  REST API + Socket.io
┌────────────────────────▼────────────────────────────────────────────┐
│                 BACKEND — Node.js + Express (Render.com)             │
│                                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  /auth   │ │ /profile │ │  /jobs   │ │   /ai    │ │/freelance│ │
│  │  Router  │ │  Router  │ │  Router  │ │  Router  │ │  Router  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                                       │
│  Middleware: JWT Auth │ Rate Limiter │ CORS │ Multer (file upload)  │
│  Real-time: Socket.io server                                         │
└──────┬──────────────┬──────────────┬──────────────┬─────────────────┘
       │              │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼──────┐ ┌────▼──────────────┐
│  MongoDB    │ │ Claude API │ │  Job APIs │ │  Razorpay / Stripe │
│   Atlas     │ │(Anthropic) │ │  Adzuna   │ │   Payment Gateway  │
│             │ │            │ │  Remotive │ │                    │
│  Users      │ │  Matches   │ │  TheMuse  │ │  Escrow / Payouts  │
│  Jobs       │ │  Profiles  │ │           │ │                    │
│  Gigs       │ │  Rankings  │ │  Cron job │ │                    │
│  Messages   │ └────────────┘ │  every 2h │ └────────────────────┘
└─────────────┘                └───────────┘
```

### Data Flow — AI Recommendation

```
User clicks "Get AI Suggestions"
        │
        ▼
Frontend sends GET /api/ai/recommend
        │
        ▼
Backend fetches user profile from MongoDB
        │
        ▼
Backend fetches latest 50 jobs from MongoDB (pulled by cron)
        │
        ▼
Backend builds prompt:
  "User skills: [...], Degree: [...], Experience: [...]
   Here are 50 live jobs: [...]
   Return top 10 ranked JSON with matchScore and reason"
        │
        ▼
Claude API processes and returns ranked JSON
        │
        ▼
Backend caches result in MongoDB (TTL: 1 hour)
        │
        ▼
Frontend displays ranked job cards with AI explanations
```

---

## 3. Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React.js | 18.x | UI framework |
| React Router | v6 | Client-side routing |
| Redux Toolkit | 2.x | Global state management |
| Tailwind CSS | 3.x | Utility-first styling |
| Axios | 1.x | HTTP requests |
| Socket.io-client | 4.x | Real-time features |
| React Hook Form | 7.x | Form handling & validation |
| React Query | 5.x | Server state, caching, loading |
| Framer Motion | 10.x | Animations |
| Lucide React | latest | Icons |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.x | HTTP server & routing |
| Mongoose | 8.x | MongoDB ODM |
| JWT | 9.x | Authentication tokens |
| Bcrypt.js | 2.x | Password hashing |
| Multer | 1.x | Resume/image file upload |
| Cloudinary | 1.x | Cloud file storage |
| Socket.io | 4.x | Real-time communication |
| Node-cron | 3.x | Scheduled job fetching |
| Axios | 1.x | Call external job APIs |
| Express-rate-limit | 7.x | API rate limiting |
| Helmet | 7.x | HTTP security headers |
| Dotenv | 16.x | Environment variables |

### AI & External APIs
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Anthropic Claude API | Job matching & profile analysis | $5 free credits |
| Adzuna API | Real job listings (India + global) | 250 req/day free |
| Remotive API | Remote job listings | Unlimited free |
| The Muse API | Company + job data | 500 req/day free |

### Infrastructure
| Service | Purpose | Cost |
|---------|---------|------|
| MongoDB Atlas | Database hosting | Free (512MB) |
| Render.com | Backend hosting | Free tier |
| Vercel | Frontend hosting | Free |
| Cloudinary | File/image storage | Free (25GB) |
| Razorpay | Payment gateway (India) | 2% per transaction |

---

## 4. Folder Structure

```
job-platform/
│
├── frontend/                          # React.js application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/                       # Axios API calls
│   │   │   ├── authApi.js
│   │   │   ├── jobsApi.js
│   │   │   ├── profileApi.js
│   │   │   ├── aiApi.js
│   │   │   └── freelanceApi.js
│   │   │
│   │   ├── components/                # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── GigCard.jsx
│   │   │   ├── AIMatchCard.jsx
│   │   │   ├── SkillBadge.jsx
│   │   │   ├── UploadResume.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── pages/                     # Page-level components
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx          # User's main dashboard
│   │   │   ├── Profile.jsx            # Edit profile page
│   │   │   ├── Jobs.jsx               # Browse all live jobs
│   │   │   ├── JobDetail.jsx          # Single job detail
│   │   │   ├── AIRecommend.jsx        # AI job suggestions
│   │   │   ├── FreelanceMarket.jsx    # Browse gigs
│   │   │   ├── PostGig.jsx            # Freelancer posts a gig
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── PostJob.jsx            # Recruiter posts a job
│   │   │   └── Messages.jsx           # Chat/messaging
│   │   │
│   │   ├── store/                     # Redux store
│   │   │   ├── index.js
│   │   │   ├── authSlice.js
│   │   │   ├── jobsSlice.js
│   │   │   └── profileSlice.js
│   │   │
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   └── useAIMatch.js
│   │   │
│   │   ├── utils/
│   │   │   ├── axiosInstance.js       # Axios with JWT interceptor
│   │   │   └── formatDate.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Node.js + Express application
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── cloudinary.js              # Cloudinary setup
│   │
│   ├── models/                        # Mongoose schemas
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Job.js
│   │   ├── Gig.js
│   │   ├── Application.js
│   │   ├── Message.js
│   │   └── AIMatch.js
│   │
│   ├── routes/                        # Express routers
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── jobs.routes.js
│   │   ├── ai.routes.js
│   │   ├── freelance.routes.js
│   │   ├── recruiter.routes.js
│   │   └── messages.routes.js
│   │
│   ├── controllers/                   # Route handler logic
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   ├── jobs.controller.js
│   │   ├── ai.controller.js
│   │   ├── freelance.controller.js
│   │   └── recruiter.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── role.middleware.js         # Role-based access
│   │   └── upload.middleware.js       # Multer config
│   │
│   ├── services/
│   │   ├── jobScraper.service.js      # Fetch jobs from APIs
│   │   ├── aiMatch.service.js         # Claude API integration
│   │   ├── payment.service.js         # Razorpay logic
│   │   └── notification.service.js    # Socket.io events
│   │
│   ├── jobs/
│   │   └── cronJobs.js                # Scheduled job fetching
│   │
│   ├── socket/
│   │   └── socket.js                  # Socket.io setup
│   │
│   ├── .env
│   ├── server.js                      # Entry point
│   └── package.json
│
└── README.md
```

---

## 5. Database Schema

### User Model (`User.js`)

```javascript
const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  role:         { type: String, enum: ['seeker', 'recruiter', 'freelancer'], default: 'seeker' },
  avatar:       { type: String, default: '' },           // Cloudinary URL
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
});
```

### Profile Model (`Profile.js`)

```javascript
const ProfileSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  headline:     { type: String },                        // "Full Stack Developer | 2 YOE"
  summary:      { type: String },
  skills:       [{ type: String }],                      // ["React", "Node.js", "Python"]
  education: [{
    degree:     String,                                  // "B.Tech Computer Science"
    institute:  String,
    year:       Number,
    grade:      String
  }],
  experience: [{
    title:      String,
    company:    String,
    from:       Date,
    to:         Date,
    current:    { type: Boolean, default: false },
    description: String
  }],
  certifications: [{
    name:       String,
    issuer:     String,
    year:       Number,
    url:        String
  }],
  resumeUrl:    { type: String },                        // Cloudinary PDF URL
  location:     { type: String },
  linkedin:     { type: String },
  github:       { type: String },
  portfolio:    { type: String },
  preferredRoles: [{ type: String }],                   // ["Backend Developer", "DevOps"]
  expectedSalary: { type: Number },                     // In INR per month
  jobType:      { type: String, enum: ['full-time', 'part-time', 'remote', 'hybrid'] },
  updatedAt:    { type: Date, default: Date.now }
});
```

### Job Model (`Job.js`)

```javascript
const JobSchema = new mongoose.Schema({
  source:       { type: String, enum: ['adzuna', 'remotive', 'muse', 'manual'] },
  externalId:   { type: String, unique: true },          // ID from external API
  title:        { type: String, required: true },
  company:      { type: String },
  location:     { type: String },
  description:  { type: String },
  skills:       [{ type: String }],                      // Extracted from description
  salary: {
    min:        Number,
    max:        Number,
    currency:   { type: String, default: 'INR' }
  },
  jobType:      { type: String, enum: ['full-time', 'part-time', 'remote', 'contract'] },
  applyUrl:     { type: String },
  postedAt:     { type: Date },
  fetchedAt:    { type: Date, default: Date.now },
  isActive:     { type: Boolean, default: true }
});
```

### Gig Model — Freelance (`Gig.js`)

```javascript
const GigSchema = new mongoose.Schema({
  freelancer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true },        // "I will build your React website"
  description:  { type: String, required: true },
  category:     { type: String },                        // "Web Development"
  skills:       [{ type: String }],
  packages: [{
    name:       { type: String, enum: ['basic', 'standard', 'premium'] },
    description: String,
    price:      Number,                                  // In INR
    deliveryDays: Number,
    revisions:  Number
  }],
  images:       [{ type: String }],                      // Cloudinary URLs
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
});
```

### Application Model (`Application.js`)

```javascript
const ApplicationSchema = new mongoose.Schema({
  job:          { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:       { type: String, enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
  aiScore:      { type: Number },                        // AI match score 0–100
  coverLetter:  { type: String },
  appliedAt:    { type: Date, default: Date.now }
});
```

### AIMatch Model (`AIMatch.js`)

```javascript
const AIMatchSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matches: [{
    job:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    score:      Number,                                  // 0–100
    reason:     String,                                  // AI explanation
    missingSkills: [String]                              // Skills to acquire
  }],
  generatedAt:  { type: Date, default: Date.now },
  expiresAt:    { type: Date }                           // TTL: 1 hour
});
```

---

## 6. API Contract

### Authentication Routes

```
POST   /api/auth/register        — Register new user
POST   /api/auth/login           — Login, returns JWT
POST   /api/auth/logout          — Invalidate token
GET    /api/auth/me              — Get current user (JWT required)
POST   /api/auth/forgot-password — Send reset email
POST   /api/auth/reset-password  — Set new password
```

### Profile Routes

```
GET    /api/profile              — Get own profile (JWT)
POST   /api/profile              — Create profile (JWT)
PUT    /api/profile              — Update profile (JWT)
POST   /api/profile/resume       — Upload resume PDF (JWT + Multer)
GET    /api/profile/:userId      — Get public profile by user ID
```

### Jobs Routes

```
GET    /api/jobs                 — Get all jobs (filters: skill, location, type, page)
GET    /api/jobs/:id             — Get single job detail
GET    /api/jobs/search?q=...    — Full-text search
POST   /api/jobs                 — Post a job (Recruiter role)
PUT    /api/jobs/:id             — Update job (Recruiter, owner only)
DELETE /api/jobs/:id             — Delete job (Recruiter, owner only)
POST   /api/jobs/:id/apply       — Apply to job (Seeker)
GET    /api/jobs/applied         — Get user's applied jobs (JWT)
```

### AI Routes

```
GET    /api/ai/recommend         — Get AI job suggestions for user (JWT)
POST   /api/ai/analyze-profile   — Get profile improvement tips (JWT)
POST   /api/ai/match-score       — Get match score for specific job (JWT)
```

### Freelance Routes

```
GET    /api/freelance/gigs             — Browse all gigs (filters)
GET    /api/freelance/gigs/:id         — Single gig detail
POST   /api/freelance/gigs             — Post a gig (Freelancer)
PUT    /api/freelance/gigs/:id         — Update gig
DELETE /api/freelance/gigs/:id         — Delete gig
POST   /api/freelance/gigs/:id/order   — Place an order (payment)
GET    /api/freelance/orders           — Get user's orders
```

### Message Routes

```
GET    /api/messages/:userId     — Get conversation with a user
POST   /api/messages/:userId     — Send message
GET    /api/messages/inbox       — Get all conversations
```

---

## 7. Phase 1 — Project Setup & Auth

> **Agent Instruction:** Execute this phase completely before moving to Phase 2.
> Verify registration, login, and JWT flow work end-to-end before proceeding.

### Step 1.1 — Initialize Backend

```bash
mkdir job-platform && cd job-platform
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken helmet express-rate-limit
npm install --save-dev nodemon
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jobplatform
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

Create `backend/server.js`:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting — 100 requests per 15 minutes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Routes
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/profile',   require('./routes/profile.routes'));
app.use('/api/jobs',      require('./routes/jobs.routes'));
app.use('/api/ai',        require('./routes/ai.routes'));
app.use('/api/freelance', require('./routes/freelance.routes'));
app.use('/api/messages',  require('./routes/messages.routes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

Create `backend/middleware/auth.middleware.js`:
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

Create `backend/controllers/auth.controller.js`:
```javascript
const User    = require('../models/User');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password: hashed, role });
    const token  = generateToken(user);

    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
```

### Step 1.2 — Initialize Frontend

```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom @reduxjs/toolkit react-redux
npm install tailwindcss @tailwindcss/vite lucide-react framer-motion
npm install react-hook-form react-hot-toast
```

Create `frontend/src/utils/axiosInstance.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

> **Agent Checkpoint 1:** Run `npm run dev` (frontend) and `nodemon server.js` (backend).
> Test `POST /api/auth/register` with Postman. Confirm a JWT is returned and user saved in Atlas.
> **Only proceed to Phase 2 when auth is fully working.**

---

## 8. Phase 2 — User Profile Builder

> **Agent Instruction:** Build the complete profile system including resume upload.
> Test that all profile fields save and retrieve correctly before Phase 3.

### Step 2.1 — Resume Upload with Cloudinary

```bash
# Backend
npm install cloudinary multer multer-storage-cloudinary
```

Create `backend/config/cloudinary.js`:
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'resumes', resource_type: 'raw', allowed_formats: ['pdf'] }
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'avatars', resource_type: 'image', allowed_formats: ['jpg', 'png', 'webp'] }
});

exports.uploadResume = multer({ storage: resumeStorage });
exports.uploadAvatar = multer({ storage: avatarStorage });
```

### Step 2.2 — Profile Controller

Create `backend/controllers/profile.controller.js`:
```javascript
const Profile = require('../models/Profile');

exports.getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const fields = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { ...fields, user: req.user.id, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  const url = req.file?.path;
  if (!url) return res.status(400).json({ message: 'No file uploaded' });
  await Profile.findOneAndUpdate({ user: req.user.id }, { resumeUrl: url });
  res.json({ resumeUrl: url });
};

exports.getPublicProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate('user', 'name email avatar role');
  if (!profile) return res.status(404).json({ message: 'Not found' });
  res.json(profile);
};
```

> **Agent Checkpoint 2:** Submit a profile with skills, education, and a PDF resume.
> Confirm the PDF URL is a Cloudinary link. Verify `GET /api/profile/:userId` returns
> the public profile without sensitive data.

---

## 9. Phase 3 — Real-Time Job Feed

> **Agent Instruction:** Set up the job scraper cron job AND the manual job posting for
> recruiters. Both must populate the same `Job` collection. After cron runs once, verify
> at least 20 jobs are in the database before Phase 4.

### Step 3.1 — Job Scraper Service

Create `backend/services/jobScraper.service.js`:
```javascript
const axios = require('axios');
const Job   = require('../models/Job');

// Fetch from Remotive (free, no key needed)
async function fetchRemotiveJobs() {
  try {
    const { data } = await axios.get('https://remotive.com/api/remote-jobs?limit=50');
    return data.jobs.map(job => ({
      source:      'remotive',
      externalId:  `remotive_${job.id}`,
      title:       job.title,
      company:     job.company_name,
      location:    job.candidate_required_location || 'Remote',
      description: job.description,
      skills:      job.tags || [],
      jobType:     'remote',
      applyUrl:    job.url,
      postedAt:    new Date(job.publication_date),
    }));
  } catch (err) {
    console.error('Remotive fetch error:', err.message);
    return [];
  }
}

// Fetch from Adzuna (requires free API key)
async function fetchAdzunaJobs(country = 'in') {
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
      `?app_id=${process.env.ADZUNA_APP_ID}` +
      `&app_key=${process.env.ADZUNA_API_KEY}` +
      `&results_per_page=50&what=developer&content-type=application/json`;

    const { data } = await axios.get(url);
    return data.results.map(job => ({
      source:      'adzuna',
      externalId:  `adzuna_${job.id}`,
      title:       job.title,
      company:     job.company?.display_name,
      location:    job.location?.display_name,
      description: job.description,
      salary:      { min: job.salary_min, max: job.salary_max, currency: 'GBP' },
      applyUrl:    job.redirect_url,
      postedAt:    new Date(job.created),
    }));
  } catch (err) {
    console.error('Adzuna fetch error:', err.message);
    return [];
  }
}

// Save jobs to DB — skip duplicates using externalId
async function saveJobs(jobs) {
  let saved = 0;
  for (const job of jobs) {
    try {
      await Job.findOneAndUpdate(
        { externalId: job.externalId },
        job,
        { upsert: true, new: true }
      );
      saved++;
    } catch (e) { /* skip duplicates */ }
  }
  console.log(`✅ Saved ${saved} jobs`);
}

exports.runScraper = async () => {
  console.log('🔍 Running job scraper...');
  const [remotive, adzuna] = await Promise.all([fetchRemotiveJobs(), fetchAdzunaJobs()]);
  await saveJobs([...remotive, ...adzuna]);
};
```

### Step 3.2 — Cron Job Setup

Create `backend/jobs/cronJobs.js`:
```javascript
const cron             = require('node-cron');
const { runScraper }   = require('../services/jobScraper.service');

// Run every 2 hours
cron.schedule('0 */2 * * *', () => {
  console.log('⏰ Cron: fetching fresh jobs...');
  runScraper();
});

// Also run once on server start
runScraper();
```

Add to `server.js`:
```javascript
require('./jobs/cronJobs');
```

> **Agent Checkpoint 3:** Confirm `GET /api/jobs?page=1&limit=20` returns at least 20 real
> job listings pulled from external APIs. Test filters: `?skills=React`, `?location=Remote`.

---

## 10. Phase 4 — AI Recommendation Engine

> **Agent Instruction:** This is the core feature. The AI must read the FULL user profile
> and return a JSON array of ranked jobs with scores and explanations. Do NOT send raw
> job HTML — extract and clean text before sending to Claude. Cache results for 1 hour.

### Step 4.1 — AI Match Service

Create `backend/services/aiMatch.service.js`:
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const Job       = require('../models/Job');
const AIMatch   = require('../models/AIMatch');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(profile, jobs) {
  const profileSummary = `
USER PROFILE:
- Name: ${profile.user?.name}
- Skills: ${profile.skills?.join(', ')}
- Education: ${profile.education?.map(e => `${e.degree} from ${e.institute} (${e.year})`).join('; ')}
- Experience: ${profile.experience?.map(e => `${e.title} at ${e.company}`).join('; ')}
- Certifications: ${profile.certifications?.map(c => c.name).join(', ')}
- Preferred Roles: ${profile.preferredRoles?.join(', ')}
- Job Type Preference: ${profile.jobType}
- Location: ${profile.location}
`;

  const jobsList = jobs.map((j, i) =>
    `JOB ${i + 1} [ID: ${j._id}]:
     Title: ${j.title} | Company: ${j.company} | Location: ${j.location}
     Required Skills: ${j.skills?.join(', ')}
     Salary: ${j.salary?.min || 'N/A'} - ${j.salary?.max || 'N/A'}
     Description (first 300 chars): ${j.description?.slice(0, 300)}...`
  ).join('\n\n');

  return `${profileSummary}

AVAILABLE JOBS:
${jobsList}

TASK:
Analyze the user profile above and rank the top 8 most suitable jobs from the list.
Return ONLY a valid JSON array. No explanation outside the JSON.

Format:
[
  {
    "jobId": "<exact MongoDB _id from the job>",
    "matchScore": <number 0-100>,
    "reason": "<2-3 sentence explanation of why this job fits the user>",
    "missingSkills": ["<skill1>", "<skill2>"],
    "salaryFit": "<good fit / overqualified / underqualified>"
  }
]`;
}

exports.getAIRecommendations = async (profile) => {
  // Check cache first
  const cached = await AIMatch.findOne({
    user: profile.user._id,
    expiresAt: { $gt: new Date() }
  }).populate('matches.job');
  if (cached) return cached.matches;

  // Fetch latest 60 active jobs
  const jobs = await Job.find({ isActive: true }).sort({ fetchedAt: -1 }).limit(60);

  const prompt = buildPrompt(profile, jobs);

  const message = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages:   [{ role: 'user', content: prompt }]
  });

  // Parse AI response
  let matches = [];
  try {
    const raw = message.content[0].text;
    const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0];
    const parsed  = JSON.parse(jsonStr);

    matches = parsed.map(item => ({
      job:          item.jobId,
      score:        item.matchScore,
      reason:       item.reason,
      missingSkills: item.missingSkills,
    }));
  } catch (e) {
    console.error('AI parse error:', e.message);
  }

  // Cache results for 1 hour
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await AIMatch.findOneAndUpdate(
    { user: profile.user._id },
    { user: profile.user._id, matches, generatedAt: new Date(), expiresAt: expiry },
    { upsert: true, new: true }
  );

  return matches;
};
```

### Step 4.2 — AI Routes

Create `backend/routes/ai.routes.js`:
```javascript
const express        = require('express');
const router         = express.Router();
const auth           = require('../middleware/auth.middleware');
const { getAIRecommendations, analyzeProfile } = require('../controllers/ai.controller');

router.get('/recommend',       auth, getAIRecommendations);
router.post('/analyze-profile', auth, analyzeProfile);

module.exports = router;
```

Create `backend/controllers/ai.controller.js`:
```javascript
const Profile   = require('../models/Profile');
const { getAIRecommendations } = require('../services/aiMatch.service');
const Job       = require('../models/Job');

exports.getAIRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Complete your profile first' });
    if (!profile.skills?.length) return res.status(400).json({ message: 'Add skills to get recommendations' });

    const matches = await getAIRecommendations(profile);

    // Populate job details
    const populated = await Promise.all(matches.map(async (m) => {
      const job = await Job.findById(m.job);
      return { ...m, job };
    }));

    res.json({ matches: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service error', error: err.message });
  }
};

exports.analyzeProfile = async (req, res) => {
  // Returns suggestions to improve the user's profile
  const profile = await Profile.findOne({ user: req.user.id });
  // ... call Claude to analyze profile completeness
  res.json({ tips: [] }); // implement similarly to above
};
```

> **Agent Checkpoint 4:** Call `GET /api/ai/recommend` with a seeker JWT. Confirm the response
> is an array of 8 jobs with `matchScore`, `reason`, and `missingSkills`. Verify caching works
> by calling the endpoint twice — second call must return instantly from cache.

---

## 11. Phase 5 — Freelance Marketplace

> **Agent Instruction:** Build the complete gig system. A freelancer posts gigs with packages.
> A client orders a gig and pays. Implement Razorpay for payment flow. Escrow holds
> payment until work is delivered and marked complete.

### Step 5.1 — Gig Routes & Controller

```javascript
// backend/routes/freelance.routes.js
const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth.middleware');
const role       = require('../middleware/role.middleware');
const controller = require('../controllers/freelance.controller');
const { uploadAvatar } = require('../config/cloudinary');

router.get   ('/',              controller.getAllGigs);
router.get   ('/:id',          controller.getGigById);
router.post  ('/',              auth, role('freelancer'), uploadAvatar.array('images', 5), controller.createGig);
router.put   ('/:id',          auth, role('freelancer'), controller.updateGig);
router.delete('/:id',          auth, role('freelancer'), controller.deleteGig);
router.post  ('/:id/order',    auth, controller.createOrder);   // Razorpay order
router.post  ('/:id/complete', auth, controller.markComplete);  // Release escrow

module.exports = router;
```

### Step 5.2 — Payment with Razorpay

```bash
npm install razorpay
```

Create `backend/services/payment.service.js`:
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order (holds payment in escrow)
exports.createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount:   amount * 100,  // Razorpay expects paise
    currency,
    receipt:  `order_${Date.now()}`,
    payment_capture: 1
  };
  return await razorpay.orders.create(options);
};

// Verify payment signature after frontend payment
exports.verifyPayment = (orderId, paymentId, signature) => {
  const crypto   = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};
```

> **Agent Checkpoint 5:** Create a gig as a freelancer. Order the gig as a seeker.
> Verify Razorpay order ID is returned. Confirm payment verification logic works with
> Razorpay test keys.

---

## 12. Phase 6 — Recruiter Dashboard

> **Agent Instruction:** Recruiters must be able to post jobs, view applicants ranked by
> AI score, and change application status. AI scores are pulled from the AIMatch cache.

### Recruiter Features to Implement

```javascript
// GET /api/recruiter/jobs            — Recruiter sees their posted jobs
// GET /api/recruiter/jobs/:id/applicants  — See all applicants for a job, sorted by AI score
// PUT /api/recruiter/applications/:id    — Update status: shortlisted / rejected / hired
// GET /api/recruiter/analytics          — Job views, application counts, hire rate

// Sample: get applicants sorted by AI score
exports.getApplicants = async (req, res) => {
  const applications = await Application.find({ job: req.params.id })
    .populate('applicant', 'name email avatar')
    .sort({ aiScore: -1 });           // Highest AI score first
  res.json(applications);
};
```

### Real-Time Notifications with Socket.io

Create `backend/socket/socket.js`:
```javascript
let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      socket.on('join', (userId) => {
        socket.join(userId);          // Join private room = userId
      });

      socket.on('disconnect', () => {
        console.log('🔌 Disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  }
};
```

Usage in controllers:
```javascript
const socket = require('../socket/socket');

// Notify applicant when status changes
socket.getIO().to(applicantUserId.toString()).emit('statusUpdate', {
  message: `Your application for ${job.title} is now ${status}`,
  jobId,
  status
});
```

> **Agent Checkpoint 6:** Log in as a recruiter. Post a job. Apply to that job as a seeker.
> Verify the recruiter can see the applicant with an AI score. Change status to "shortlisted"
> and confirm the seeker receives a real-time notification.

---

## 13. Phase 7 — UI/UX & Design System

> **Agent Instruction:** The UI must be attractive to three audiences: job seekers,
> recruiters, and freelancers. Use Tailwind CSS with a consistent design system.
> Every page must be fully responsive (mobile + desktop).

### Tailwind Design Tokens

Configure `tailwind.config.js`:
```javascript
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366F1', dark: '#4F46E5' },   // Indigo
        secondary: { DEFAULT: '#0EA5E9' },                     // Sky blue
        accent:    { DEFAULT: '#F59E0B' },                     // Amber (freelance)
        success:   { DEFAULT: '#10B981' },
        danger:    { DEFAULT: '#EF4444' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      }
    }
  }
}
```

### Key Pages & Their UI

**Home Page** — Hero with animated job titles, 3 role cards (Seeker / Recruiter / Freelancer),
stats bar (X jobs live, X companies, X freelancers), recent job cards, CTA to register.

**Dashboard** — Left sidebar navigation, profile completion progress bar, AI match score
card, recent applications list, real-time notification bell.

**AI Recommendations Page** — Grid of job cards with gradient match score badge (green 80+,
yellow 60-80, red <60), AI reason tooltip, "Missing skills" chips, one-click apply button.

**Freelance Marketplace** — Category filter tabs, gig cards with seller avatar, rating stars,
package prices, "Order Now" button with Razorpay modal.

### Component Example — AI Match Card

```jsx
// frontend/src/components/AIMatchCard.jsx
import { Sparkles, MapPin, Briefcase, AlertCircle } from 'lucide-react';

export default function AIMatchCard({ match }) {
  const { job, score, reason, missingSkills } = match;

  const scoreColor =
    score >= 80 ? 'bg-green-100 text-green-700' :
    score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
          <p className="text-gray-500 text-sm">{job.company} · {job.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scoreColor}`}>
          <Sparkles size={12} className="inline mr-1" />{score}% match
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{reason}</p>

      {missingSkills?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-orange-600 flex items-center gap-1 mb-1">
            <AlertCircle size={12} /> Skills to acquire:
          </p>
          <div className="flex flex-wrap gap-1">
            {missingSkills.map(s => (
              <span key={s} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <a href={job.applyUrl} target="_blank" rel="noreferrer"
           className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          Apply Now
        </a>
        <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          Save
        </button>
      </div>
    </div>
  );
}
```

> **Agent Checkpoint 7:** Open the app on both mobile (375px) and desktop (1280px).
> All pages must be fully responsive. AI match cards must show correct color-coded
> scores. No layout overflow or broken spacing.

---

## 14. Phase 8 — Testing

> **Agent Instruction:** Write and run ALL tests below before deployment. Zero known
> bugs must exist in the final build. Test every user role independently.

### Backend Tests

```bash
npm install --save-dev jest supertest
```

Test file: `backend/__tests__/auth.test.js`:
```javascript
const request = require('supertest');
const app     = require('../server');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User', email: 'test@test.com', password: 'test123', role: 'seeker'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register with duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'test@test.com', password: 'test123', role: 'seeker'
    });
    expect(res.statusCode).toBe(400);
  });

  it('should login and return token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com', password: 'test123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Manual QA Checklist

```
[ ] Register as Seeker, Recruiter, Freelancer — all 3 roles
[ ] Login / Logout works, JWT stored and cleared
[ ] Profile save with all fields including resume PDF upload
[ ] Job feed loads with real data, pagination works
[ ] Search and filter jobs by skill and location
[ ] AI recommendation returns 8 ranked jobs with scores
[ ] AI cache returns same results on second request (fast)
[ ] Freelancer can post a gig with images
[ ] Client can order a gig, Razorpay modal opens
[ ] Recruiter posts a job, seeker applies
[ ] Recruiter sees applicants sorted by AI score
[ ] Status change triggers real-time notification
[ ] All pages responsive on mobile (375px)
[ ] No console errors in browser
[ ] All API errors return proper error messages
```

---

## 15. Phase 9 — Deployment

> **Agent Instruction:** Deploy in this exact order: Database → Backend → Frontend.
> Do NOT deploy frontend before backend URL is confirmed working.

### Step 9.1 — MongoDB Atlas

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user with password
3. Whitelist IP `0.0.0.0/0` (allow all — safe for development)
4. Copy connection string → `MONGO_URI` in environment

### Step 9.2 — Deploy Backend to Render.com

1. Push backend to GitHub repository
2. Create new **Web Service** at [render.com](https://render.com)
3. Connect GitHub repo → select backend folder
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add ALL environment variables from `.env`
7. Note the live URL: `https://your-api.onrender.com`

### Step 9.3 — Deploy Frontend to Vercel

```bash
# In frontend folder
npm run build
```

1. Push frontend to GitHub
2. Create new project at [vercel.com](https://vercel.com)
3. Connect GitHub repo → select frontend folder
4. Set environment variable: `VITE_API_URL=https://your-api.onrender.com/api`
5. Deploy

### Step 9.4 — Final Production Checklist

```
[ ] MONGO_URI points to Atlas (not localhost)
[ ] JWT_SECRET is a long random string (32+ chars)
[ ] CORS origin set to Vercel frontend URL
[ ] All API keys are production keys (not test)
[ ] Razorpay is set to live mode
[ ] HTTPS enforced (Vercel and Render do this automatically)
[ ] Error logging set up (use console.error or integrate Sentry)
[ ] Rate limiting is active
[ ] Cron job runs every 2 hours (verify in Render logs)
```

---

## 16. Environment Variables Reference

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobplatform

# Auth
JWT_SECRET=your_very_long_random_secret_key_here_min_32_chars

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Job APIs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key

# Cloudinary (file storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend `.env`

```env
VITE_API_URL=https://your-api.onrender.com/api
VITE_SOCKET_URL=https://your-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_...
```

---

## 17. Agentic Execution Checklist

> This is the master checklist for the AI agent. Check off each item as you complete it.
> Never mark an item done until it is verified to work in a running environment.

```
PHASE 1 — AUTH & SETUP
[ ] 1.1  Backend initialized with all dependencies installed
[ ] 1.2  MongoDB Atlas cluster created and connection verified
[ ] 1.3  User model created with all fields
[ ] 1.4  Auth controller (register, login, getMe) implemented
[ ] 1.5  JWT middleware working — protected route returns 401 without token
[ ] 1.6  Frontend initialized with Vite + React
[ ] 1.7  Axios instance with JWT interceptor working
[ ] 1.8  Register page → success → redirect to dashboard
[ ] 1.9  Login page → success → JWT stored in localStorage
[ ] 1.10 Logout clears token and redirects to /login

PHASE 2 — PROFILE
[ ] 2.1  Profile schema matches spec above
[ ] 2.2  Profile create/update API works for all fields
[ ] 2.3  Cloudinary configured for resume and avatar upload
[ ] 2.4  PDF resume uploads to Cloudinary, URL saved in DB
[ ] 2.5  Profile completion % calculated and shown in UI
[ ] 2.6  Profile page UI is fully functional

PHASE 3 — JOB FEED
[ ] 3.1  Job schema matches spec
[ ] 3.2  Remotive API fetch tested — returns jobs
[ ] 3.3  Adzuna API fetch tested — returns jobs
[ ] 3.4  Cron job runs on server start and every 2 hours
[ ] 3.5  /api/jobs returns paginated job list
[ ] 3.6  Search and filter working (skill, location, type)
[ ] 3.7  Recruiter can post manual job via POST /api/jobs
[ ] 3.8  Job cards UI shows title, company, skills, salary

PHASE 4 — AI ENGINE
[ ] 4.1  Anthropic SDK installed, API key configured
[ ] 4.2  Prompt correctly includes user profile AND job list
[ ] 4.3  Claude returns valid JSON array (no parse errors)
[ ] 4.4  Matches saved to AIMatch collection with TTL
[ ] 4.5  Cache serves results on second request within 1 hour
[ ] 4.6  Match cards show score, reason, missingSkills
[ ] 4.7  Score color-coding working (green/yellow/red)

PHASE 5 — FREELANCE
[ ] 5.1  Gig model with packages schema working
[ ] 5.2  Freelancer can post gig with images
[ ] 5.3  Gig browse page with category filters
[ ] 5.4  Razorpay order creation API working
[ ] 5.5  Payment verification logic tested with test keys
[ ] 5.6  Order status tracking in DB

PHASE 6 — RECRUITER
[ ] 6.1  Recruiter role-based routes enforced
[ ] 6.2  Job posting with all fields working
[ ] 6.3  Applicant list sorted by AI score
[ ] 6.4  Status update API working
[ ] 6.5  Socket.io initialized and connected on frontend
[ ] 6.6  Status change notification reaches seeker in real-time

PHASE 7 — UI/UX
[ ] 7.1  All pages use consistent Tailwind design system
[ ] 7.2  Mobile responsive (375px → 1440px)
[ ] 7.3  Landing page hero, role cards, stats bar complete
[ ] 7.4  Loading states on all async operations
[ ] 7.5  Error messages shown for all failures
[ ] 7.6  Toast notifications for success/error actions

PHASE 8 — TESTING
[ ] 8.1  All manual QA checklist items verified
[ ] 8.2  No console errors in browser
[ ] 8.3  All 3 user roles fully tested
[ ] 8.4  API error handling tested with bad inputs
[ ] 8.5  JWT expiry handled gracefully (auto-logout)

PHASE 9 — DEPLOYMENT
[ ] 9.1  Backend deployed to Render — health check passes
[ ] 9.2  MongoDB Atlas connected from Render
[ ] 9.3  All env vars set in Render dashboard
[ ] 9.4  Frontend deployed to Vercel — builds successfully
[ ] 9.5  VITE_API_URL points to Render backend
[ ] 9.6  CORS origin set to Vercel URL in backend
[ ] 9.7  End-to-end flow works on production URLs
[ ] 9.8  Cron job running in production (check Render logs)
[ ] 9.9  AI recommendations working in production
[ ] 9.10 Payment flow works with live Razorpay keys

✅ PROJECT COMPLETE — All 45 checkpoints verified
```

---

## Quick Start Summary

```bash
# 1. Clone and install
git clone <your-repo>
cd job-platform

# 2. Start backend
cd backend && cp .env.example .env    # fill in your keys
npm install && nodemon server.js

# 3. Start frontend (new terminal)
cd frontend && cp .env.example .env   # set VITE_API_URL
npm install && npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000/api
```

---

*Architecture version 1.0 — Built for beginners, production-ready output.*
*Follow each phase in sequence. The agent must not skip phases.*
