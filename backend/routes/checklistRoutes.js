const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Import db connection

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

// Add checklist item route
router.post('/add-checklist-item', (req, res) => {
  const { item } = req.body;
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.id;
    const insertItemQuery = 'INSERT INTO checklist (user_id, item, is_checked) VALUES (?, ?, ?)';
    db.query(insertItemQuery, [userId, item, false], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Item added to checklist' });
    });
  });
});

// Get checklist items route
router.get('/get-checklist-items', (req, res) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.id;
    const getItemsQuery = 'SELECT * FROM checklist WHERE user_id = ?';
    db.query(getItemsQuery, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      return res.json({ checklistItems: results });
    });
  });
});

// Update checklist item state route
router.put('/update-checklist-item', (req, res) => {
  const { item, is_checked } = req.body;
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.id;
    const updateItemQuery = 'UPDATE checklist SET is_checked = ? WHERE user_id = ? AND item = ?';
    db.query(updateItemQuery, [is_checked, userId, item], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Item updated successfully' });
    });
  });
});

// Delete checklist item route
router.delete('/delete-checklist-item', (req, res) => {
  const { item } = req.body;
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.id;
    const deleteItemQuery = 'DELETE FROM checklist WHERE user_id = ? AND item = ?';
    db.query(deleteItemQuery, [userId, item], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Item deleted successfully' });
    });
  });
});

module.exports = router;
