const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const http = require('http');
require('dotenv').config();

const connectDB = require('./config/db');
const socket = require('./socket/socket');
const errorHandler = require('./middleware/error.middleware');
const requestId = require('./middleware/requestId.middleware');
const xssSanitizer = require('./middleware/xss.middleware');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socket.init(server);

// Trust proxy — required on Render / Heroku for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Request ID — attach unique ID to every request for tracing
app.use(requestId);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Security middleware
app.use(helmet());
app.use(compression()); // Gzip responses
app.use(cookieParser()); // Parse cookies (for refresh tokens)

// Custom NoSQL injection prevention (Express 5 compatible — only sanitize body)
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) { delete obj[key]; continue; }
      if (typeof obj[key] === 'object') sanitize(obj[key]);
    }
    return obj;
  };
  if (req.body) req.body = sanitize(req.body);
  next();
});
// Note: hpp removed — Express 5 makes req.query read-only, providing built-in HPP protection

// CORS — support multiple origins for staging + production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// XSS sanitization — strip dangerous HTML from all request bodies
app.use(xssSanitizer);

// ─── Rate Limiters ───

// General: 300 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', generalLimiter);

// Stricter rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);


// Password reset rate limit
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password reset requests. Please try again later.' },
});
app.use('/api/auth/forgot-password', passwordResetLimiter);

// Message sending rate limit (prevent spam)
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { message: 'Sending too many messages. Slow down.' },
});
app.use('/api/messages', messageLimiter);

// Public profile rate limit (prevent enumeration)
const publicProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many profile requests. Please try again later.' },
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    uptime: Math.round(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/jobs', require('./routes/jobs.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/freelance', require('./routes/freelance.routes'));
app.use('/api/recruiter', require('./routes/recruiter.routes'));
app.use('/api/messages', require('./routes/messages.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Root
app.get('/', (req, res) => {
  res.json({ message: 'JobPlatform API is running', version: '1.0.0', docs: '/health' });
});

// Global error handler (must be AFTER all routes)
app.use(errorHandler);

// Connect to DB
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<user>') && process.env.MONGO_URI !== 'mongodb_connection_string_here') {
  connectDB().then(() => {
    require('./jobs/cronJobs').startCronJobs();
  });
} else {
  logger.warn('MONGO_URI not set or is a placeholder. Skipping DB connection.');
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Graceful shutdown
function gracefulShutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
