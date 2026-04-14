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

// Check room availability
router.post('/check-availability', async (req, res) => {
  const { room_id, check_in, check_out } = req.body;
  if (!room_id || !check_in || !check_out) {
    return res.status(400).json({ error: 'room_id, check_in, check_out required' });
  }
  try {
    const roomResult = await query('SELECT total_rooms FROM rooms WHERE id = $1', [room_id]);
    if (!roomResult.rows.length) return res.status(404).json({ error: 'Room not found' });
    const totalRooms = roomResult.rows[0].total_rooms;

    const bookingsResult = await query(
      `SELECT COUNT(*) as booked FROM bookings 
       WHERE room_id = $1 AND status NOT IN ('cancelled')
       AND NOT (check_out <= $2 OR check_in >= $3)`,
      [room_id, check_in, check_out]
    );
    const booked = parseInt(bookingsResult.rows[0].booked);
    const available = totalRooms - booked;
    res.json({ available: available > 0, available_count: Math.max(0, available) });
  } catch (err) {
    res.status(500).json({ error: 'Availability check failed' });
  }
});

module.exports = router;
