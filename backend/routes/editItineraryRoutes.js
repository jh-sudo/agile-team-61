// editItineraryRoutes.js
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

// Get itinerary and activities
router.get('/itinerary/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const itineraryQuery = 'SELECT * FROM itinerary_metadata WHERE id = ?';
  db.query(itineraryQuery, [id], (err, rows) => {
    if (err) {
      console.error('Database error while fetching itinerary metadata:', err);
      return res.status(500).json({ error: 'Database error occurred while fetching itinerary metadata' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const itinerary = rows[0];

    const activitiesQuery = 'SELECT * FROM itinerary WHERE itinerary_metadata_id = ?';
    db.query(activitiesQuery, [id], (err, activities) => {
      if (err) {
        console.error('Database error while fetching activities:', err);
        return res.status(500).json({ error: 'Database error occurred while fetching activities' });
      }

      res.json({ itinerary, activities });
    });
  });
});

// Update itinerary metadata
router.put('/itinerary/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { itinerary, activities } = req.body;

  if (!itinerary || !activities) {
    return res.status(400).json({ error: 'Missing itinerary or activities data' });
  }

  const updateItineraryQuery = 'UPDATE itinerary_metadata SET title = ?, period = ? WHERE id = ?';
  db.query(updateItineraryQuery, [itinerary.title, itinerary.period, id], (err) => {
    if (err) {
      console.error('Database error while updating itinerary metadata:', err);
      return res.status(500).json({ error: 'Database error occurred while updating itinerary metadata' });
    }

    const deleteActivitiesQuery = 'DELETE FROM itinerary WHERE itinerary_metadata_id = ?';
    db.query(deleteActivitiesQuery, [id], (err) => {
      if (err) {
        console.error('Database error while deleting activities:', err);
        return res.status(500).json({ error: 'Database error occurred while deleting activities' });
      }

      const insertActivitiesQuery = 'INSERT INTO itinerary (itinerary_metadata_id, day, title, details) VALUES ?';
      const activityValues = activities.map(a => [id, a.day, a.title, a.details]);

      db.query(insertActivitiesQuery, [activityValues], (err) => {
        if (err) {
          console.error('Database error while inserting activities:', err);
          return res.status(500).json({ error: 'Database error occurred while inserting activities' });
        }

        res.status(200).json({ message: 'Itinerary updated successfully' });
      });
    });
  });
});

// Save Title and Period
router.post('/save-title-period/:id', authenticateToken, (req, res) => {
    console.log('Received itineraryId:', req.params.id);
    console.log('Received body:', req.body); // Log the request body for inspection
    const { title, period } = req.body;
  const itineraryMetadataId = req.params.id;
  const userId = req.user.id;

  if (!title || !period || !itineraryMetadataId) {
    return res.status(400).json({ error: 'Title, period, and itinerary_metadata_id are required' });
  }

  const query = 'UPDATE itinerary_metadata SET title = ?, period = ? WHERE id = ? AND user_id = ?';

  // Execute database query
  db.query(query, [title, period, itineraryMetadataId, userId], (err) => {
    if (err) {
      console.error('Database error while saving title and period:', err);
      return res.status(500).json({ error: 'Database error occurred while saving title and period' });
    }

    // Successful save
    return res.json({ message: 'Title and period saved successfully' });
  });
});

// Save an itinerary item
router.post('/save-itinerary/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { day, title, details } = req.body;
  
    // Log received data
    console.log('Received data:', { id, day, title, details });
  
    if (!day || !title || !details) {
      return res.status(400).json({ error: 'Day, title, and details are required' });
    }
  
    const query = 'UPDATE itinerary SET day = ?, title = ?, details = ? WHERE id = ?';
    db.query(query, [day, title, details, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      console.log('Query result:', result);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Itinerary item not found' });
      }
  
      res.json({ message: 'Itinerary item updated successfully' });
    });
});
  
  
  


// Add New Itinerary Activity
router.post('/add-item/:id', authenticateToken, (req, res) => {
  const { day, title, details } = req.body;
  const userId = req.user.id;
  const itineraryMetadataId = req.params.id;

  if (!day || !title || !details || !itineraryMetadataId) {
    return res.status(400).json({ error: 'Day, title, details, and itinerary_metadata_id are required' });
  }

  const query = 'INSERT INTO itinerary (user_id, itinerary_metadata_id, day, title, details) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userId, itineraryMetadataId, day, title, details], (err) => {
    if (err) {
      console.error('Database error while adding itinerary activity:', err);
      return res.status(500).json({ error: 'Database error occurred while adding itinerary activity' });
    }
    return res.json({ message: 'Itinerary activity added successfully' });
  });
});

// Add New Day
router.post('/add-day/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itineraryMetadataId = req.params.id;
  const { day } = req.body;
  

  if (!day || !itineraryMetadataId) {
    return res.status(400).json({ error: 'Day and itinerary_metadata_id are required' });
  }

  const query = 'INSERT INTO itinerary (user_id, itinerary_metadata_id, day, title, details) VALUES (?, ?, ?, ?, ?)';
  const defaultTitle = `Day ${day} Activity`;
  const defaultDetails = `Details for Day ${day}`;

  db.query(query, [userId, itineraryMetadataId, day, defaultTitle, defaultDetails], (err) => {
    if (err) {
      console.error('Database error while adding new day:', err);
      return res.status(500).json({ error: 'Database error occurred while adding new day' });
    }
    return res.json({ message: 'New day added successfully' });
  });
});

module.exports = router;
