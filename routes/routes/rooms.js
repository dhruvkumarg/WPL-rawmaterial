const express = require('express');
const { query } = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all active rooms
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM rooms WHERE is_active = TRUE ORDER BY price_per_night ASC'
    );
    res.json({ rooms: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM rooms WHERE id = $1 AND is_active = TRUE', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Room not found' });
    res.json({ room: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});
