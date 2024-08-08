const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Display the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle the registration form submission
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    const insertQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    db.run(insertQuery, [username, email, passwordHash], function(err) {
        if (err) {
            console.error(err.message);
            return res.render('register', { error: 'Error registering user.' });
        }
        res.redirect('/login');
    });
});

module.exports = router;
