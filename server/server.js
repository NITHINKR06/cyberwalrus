import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any localhost port for development
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // In production, you would check against a whitelist
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Session tracking middleware
app.use((req, res, next) => {
  if (!req.session.sessionId) {
    req.session.sessionId = uuidv4();
  }
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walrus_db')
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Import routes
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import analyzerRoutes from './routes/analyzer.js';
import userRoutes from './routes/user.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    sessionId: req.session.sessionId,
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
