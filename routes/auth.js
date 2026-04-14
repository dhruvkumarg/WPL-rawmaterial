'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Check for validation errors and respond if any exist
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
};

// Sign and return a JWT for the given user ID
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// ─── REGISTER ───────────────────────────────────────────────────────────────

const registerValidators = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 characters required'),
];

const registerHandler = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role`,
      [name, email, hashedPassword, phone || null, 'member']
    );

    const user = newUser.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

router.post('/register', registerValidators, registerHandler);

// ─── LOGIN ───────────────────────────────────────────────────────────────────

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const loginHandler = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'No account found. Please register.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user.id);
    const { password_hash, ...safeUser } = user;

    res.json({ token, user: safeUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

router.post('/login', loginValidators, loginHandler);

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

const forgotPasswordHandler = async (req, res) => {
  if (handleValidation(req, res)) return;

  const { email } = req.body;

  try {
    const result = await db.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      message: 'Contact support at reservations@tnghotels.com or +91 90826 90060',
      name: result.rows[0].name,
    });

  } catch (error) {
    res.status(500).json({ error: 'Request failed' });
  }
};

router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], forgotPasswordHandler);

// ─── GET CURRENT USER ────────────────────────────────────────────────────────

const getMeHandler = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

router.get('/me', authenticate, getMeHandler);

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────

const updateProfileHandler = async (req, res) => {
  const { name, phone } = req.body;

  try {
    const updatedUser = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, phone, role`,
      [name || null, phone || null, req.user.id]
    );

    res.json({ user: updatedUser.rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

router.put('/profile', authenticate, updateProfileHandler);

// ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────

const changePasswordHandler = async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Both passwords are required' });
  }

  try {
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const valid = await bcrypt.compare(
      current_password,
      result.rows[0].password_hash
    );

    if (!valid) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(new_password, 10);

    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Password update failed' });
  }
};

router.put('/change-password', authenticate, changePasswordHandler);

module.exports = router;
