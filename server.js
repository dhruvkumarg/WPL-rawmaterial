require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool } = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const testimonialsRoutes = require('./routes/testimonials');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Fix rate-limit IP detection behind Railway/Vercel proxy
app.set('trust proxy', 1);

// Verify database connectivity at startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.error('👉 Check your DATABASE_URL in backend/.env');
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});

// Apply security headers
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));

// Permitted origins: local dev + all Vercel deployment URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'https://tng-hotelsandbanquets.vercel.app',
  'https://tng-hotelsandbanquets-git-main-aravghiya1904-1096s-projects.vercel.app',
  'https://tng-hotelsandbanquets-bx16ocpht-aravghiya1904-1096s-projects.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permit originless requests (e.g. Postman, native mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Permit everything in local development
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Respond to all preflight requests
app.options('*', cors());

// API rate limiter — relies on trust proxy set above for correct IP resolution
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

// Parse incoming request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TNG Hotels API running', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'TNG Hotels & Banquets API', version: '1.0.0' });
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Centralised error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS: Origin not allowed' });
  }
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TNG Hotels API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
});
