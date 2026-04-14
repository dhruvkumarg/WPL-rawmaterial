'use strict';

const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

const fetchUserById = async (id) => {
  const result = await query(
    'SELECT id, name, email, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// ─── AUTHENTICATE ─────────────────────────────────────────────────────────────

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await fetchUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ─── REQUIRE ADMIN ────────────────────────────────────────────────────────────

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ─── OPTIONAL AUTH ────────────────────────────────────────────────────────────

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await fetchUserById(decoded.id);
      if (user) req.user = user;
    }

  } catch {}

  next();
};

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = { authenticate, requireAdmin, optionalAuth };
