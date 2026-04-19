const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const connectDB = require('./config/db');
const socket = require('./socket/socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socket.init(server);

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting — 100 requests per 15 minutes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/jobs', require('./routes/jobs.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/freelance', require('./routes/freelance.routes'));
app.use('/api/recruiter', require('./routes/recruiter.routes'));
app.use('/api/messages', require('./routes/messages.routes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Avoid connecting to DB if we don't have a URI yet to prevent crashing initially
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb_connection_string_here') {
  connectDB().then(() => {
    require('./jobs/cronJobs').startCronJobs();
  });
} else {
  console.log('⚠️ MONGO_URI not set or is properly placeholder. Skipping DB connection.');
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
