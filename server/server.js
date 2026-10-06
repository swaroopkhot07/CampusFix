import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './utils/db.js';
import authRoutes from './routes/auth.js';
import issuesRoutes from './routes/issues.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development and mobile/testing clients
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers with support for base64 photo uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    server: 'CampusFix API (CSMU Panvel)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER UNHANDLED ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
});

// Initialize database and start listening
try {
  await initDb();
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`  CampusFix Server running on http://localhost:${PORT}`);
      console.log(`  CORS enabled for: ${CLIENT_URL}`);
      console.log(`  Chhatrapati Shivaji Maharaj University (CSMU), Panvel`);
      console.log(`====================================================`);
    });
  }
} catch (err) {
  console.error('Failed to initialize CampusFix backend server:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

export default app;
