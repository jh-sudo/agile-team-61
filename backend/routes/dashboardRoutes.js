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

router.get('/itinerary', (req, res) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  } 

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.id;
    
    // Fetch the itinerary items
    const query = 'SELECT * FROM itinerary WHERE user_id = ? ORDER BY day, id';
    db.query(query, [userId], (err, rows) => {
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
      const titlePeriodQuery = 'SELECT title, period FROM itinerary_metadata WHERE user_id = ? LIMIT 1';
      db.query(titlePeriodQuery, [userId], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error occurred while fetching metadata' });
        }
        
        const itineraryTitle = row[0]?.title || 'Your Itinerary';
        const itineraryPeriod = row[0]?.period || 'Time Period';

        res.json({ itinerary, itineraryTitle, itineraryPeriod });
      });
    });
  });
});

// Save Itinerary Item
router.post('/save-itinerary', authenticateToken, (req, res) => {
  const { id, title, details } = req.body;
  const userId = req.user.id;

  const query = 'UPDATE itinerary SET title = ?, details = ? WHERE id = ? AND user_id = ?';
  db.query(query, [title, details, id, userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while saving itinerary item' });
    }
    return res.json({ message: 'Itinerary item saved successfully' });
  });
});

// Save Title and Period
router.post('/save-title-period', authenticateToken, (req, res) => {
  const { title, period } = req.body;
  const userId = req.user.id;

  const query = 'REPLACE INTO itinerary_metadata (user_id, title, period) VALUES (?, ?, ?)';
  db.query(query, [userId, title, period], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while saving title and period' });
    }
    return res.json({ message: 'Title and period saved successfully' });
  });
});

// Add New Day
router.post('/add-day', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { day } = req.body;

  const query = 'INSERT INTO itinerary (user_id, day, title, details) VALUES (?, ?, ?, ?)';
  const defaultTitle = `Day ${day} Activity`;
  const defaultDetails = `Details for Day ${day}`;

  db.query(query, [userId, day, defaultTitle, defaultDetails], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while adding new day' });
    }
    return res.json({ message: 'New day added successfully' });
  });
});

// Add New Itinerary Item
router.post('/add-item', authenticateToken, (req, res) => {
  const { day, title, details } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO itinerary (user_id, day, title, details) VALUES (?, ?, ?, ?)';
  db.query(query, [userId, day, title, details], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while adding itinerary item' });
    }
    return res.json({ message: 'Itinerary item added successfully' });
  });
});

module.exports = router;