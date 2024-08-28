const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: decoded.id };
    next();
  });
};

// Save Title and Period
router.post('/new-itinerary', authenticateToken, (req, res) => {
  const { title, period } = req.body;
  const userId = req.user.id;

  if (!title || !period) {
    return res.status(400).json({ error: 'Title and period are required' });
  }

  const query = 'INSERT INTO itinerary_metadata (title, period, user_id) VALUES (?, ?, ?)';

  // Execute database query
  db.query(query, [title, period, userId], (err, results) => {
    if (err) {
      console.error('Database error while saving title and period:', err);
      return res.status(500).json({ error: 'Database error occurred while saving title and period' });
    }
    // Successful save
    return res.json({ message: 'Title and period saved successfully', id: results.insertId });
  });
});

// Fetch the itinerary data
router.get('/itinerary/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // Fetch the itinerary items
  const query = 'SELECT * FROM itinerary WHERE user_id = ? AND itinerary_metadata_id = ? ORDER BY day, id';
  db.query(query, [userId, id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while fetching itinerary' });
    }

    const itinerary = {};
    rows.forEach(row => {
      if (!itinerary[`day${row.day}`]) {
        itinerary[`day${row.day}`] = [];
      }
      itinerary[`day${row.day}`].push(row);
    });

    // Fetch metadata
    const titlePeriodQuery = 'SELECT title, period FROM itinerary_metadata WHERE user_id = ? AND id = ?';
    db.query(titlePeriodQuery, [userId, id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred while fetching metadata' });
      }

      const itineraryTitle = row[0]?.title || 'Your Itinerary';
      const itineraryPeriod = row[0]?.period || 'Time Period';

      res.json({ itinerary, itineraryTitle, itineraryPeriod });
    });
  });
});

// Fetch itinerary metadata to be displayed in itinerary home
router.get('/itineraries', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT id, title, period, last_edited FROM itinerary_metadata WHERE user_id = ?';

  db.query(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while fetching itineraries' });
    }
    res.json({ itineraries: rows });
  });
});

module.exports = router;
