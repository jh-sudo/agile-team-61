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

router.get('/itinerary/:id', (req, res) => {
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

// In your backend routes file
router.get('/itineraries', authenticateToken, (req, res) => {
  const userId = req.user.id; // Ensure you have user ID from authentication middleware

  // Query to fetch itinerary metadata
  const query = 'SELECT id, title, period, last_edited FROM itinerary_metadata WHERE user_id = ?';

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Database error occurred while fetching itineraries' });
    }
    res.json({ itineraries: rows });
  });
});

// Save Itinerary Item
router.post('/save-itinerary/:id', authenticateToken, (req, res) => {
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
router.post('/save-title-period/:id', authenticateToken, (req, res) => {
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
router.post('/add-day/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const itineraryMetadataId = req.params.id; // Use the ID from the URL parameter
  const { day } = req.body;

  if (!itineraryMetadataId) {
    return res.status(400).json({ error: 'Itinerary ID is required' });
  }

  const query = 'INSERT INTO itinerary (user_id, itinerary_metadata_id, day, title, details) VALUES (?, ?, ?, ?, ?)';
  const defaultTitle = `Day ${day} Activity`;
  const defaultDetails = `Details for Day ${day}`;

  db.query(query, [userId, itineraryMetadataId, day, defaultTitle, defaultDetails], (err) => {
    if (err) {
      console.error('Database error:', err); // Log the error for debugging
      return res.status(500).json({ error: 'Database error occurred while adding new day' });
    }
    return res.json({ message: 'New day added successfully' });
  });
});


// Add New Itinerary Item
router.post('/add-item/:id', authenticateToken, (req, res) => {
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

//edit itinerary page routes
// GET /api/itinerary/:id
router.get('/itinerary/:id', (req, res) => {
  const { id } = req.params;
  
  // Query to fetch itinerary metadata
  const itineraryQuery = 'SELECT * FROM itinerary_metadata WHERE id = ?';
  db.query(itineraryQuery, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while fetching itinerary metadata' });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    
    const itinerary = rows[0];
    
    // Query to fetch activities
    const activitiesQuery = 'SELECT * FROM itinerary_items WHERE itinerary_id = ?';
    db.query(activitiesQuery, [id], (err, activities) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred while fetching activities' });
      }
      
      res.json({ itinerary, activities });
    });
  });
});

// PUT /api/itinerary/:id
router.put('/itinerary/:id', (req, res) => {
  const { id } = req.params;
  const { itinerary, activities } = req.body;
  
  // Update itinerary metadata
  const updateItineraryQuery = 'UPDATE itinerary_metadata SET title_of_trip = ?, period = ? WHERE id = ?';
  db.query(updateItineraryQuery, [itinerary.title_of_trip, itinerary.period, id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred while updating itinerary metadata' });
    }
    
    // Update activities
    const deleteActivitiesQuery = 'DELETE FROM itinerary_items WHERE itinerary_id = ?';
    db.query(deleteActivitiesQuery, [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred while deleting activities' });
      }
      
      const insertActivitiesQuery = 'INSERT INTO itinerary_items (itinerary_id, title_of_activity, details) VALUES ?';
      const activityValues = activities.map(a => [id, a.title_of_activity, a.details]);
      
      db.query(insertActivitiesQuery, [activityValues], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error occurred while inserting activities' });
        }
        
        res.status(200).json({ message: 'Itinerary updated successfully' });
      });
    });
  });
});


module.exports = router;