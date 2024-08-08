const express = require('express');
const router = express.Router();

// Dashboard route
router.get('/dashboard', (req, res) => {
    const query = 'SELECT * FROM itinerary ORDER BY day, id';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            const itinerary = { day1: [], day2: [], day3: [] };
            rows.forEach(row => {
                if (row.day === 1) itinerary.day1.push(row);
                if (row.day === 2) itinerary.day2.push(row);
                if (row.day === 3) itinerary.day3.push(row);
            });

            // Fetch title and period
            const titlePeriodQuery = 'SELECT * FROM itinerary_metadata LIMIT 1';
            db.get(titlePeriodQuery, [], (err, row) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Internal Server Error");
                } else {
                    const itineraryTitle = row?.title || 'Your Itinerary';
                    const itineraryPeriod = row?.period || 'Time Period';
                    res.render('dashboard', { itinerary, itineraryTitle, itineraryPeriod });
                }
            });
        }
    });
});

// Save itinerary route
router.post('/save-itinerary', (req, res) => {
    const { id, title, details } = req.body;
    if (!id || !title || !details) {
        return res.status(400).send("Bad Request");
    }
    const query = 'UPDATE itinerary SET title = ?, details = ? WHERE id = ?';
    db.run(query, [title, details, id], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendStatus(200);
        }
    });
});

// Save title and period route
router.post('/save-title-period', (req, res) => {
    const { title, period } = req.body;
    const query = 'REPLACE INTO itinerary_metadata (id, title, period) VALUES (1, ?, ?)';
    db.run(query, [title, period], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendStatus(200);
        }
    });
});

// Add itinerary item route
router.post('/add-itinerary', (req, res) => {
    const { day, title, details } = req.body;
    if (!day || !title || !details) {
        return res.status(400).send("Bad Request");
    }
    const query = 'INSERT INTO itinerary (day, title, details) VALUES (?, ?, ?)';
    db.run(query, [day, title, details], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
