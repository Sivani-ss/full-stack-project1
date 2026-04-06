const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL // e.g. https://full-stack-project1-eight.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools/no-origin + allowed browser origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoissue_campus')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'EcoIssue Campus Hub API' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
