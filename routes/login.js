const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Display the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle the login form submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for the user
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.render('login', { error: 'An error occurred. Please try again.' });
        }

        // Check if the user exists and the password is correct
        if (user && bcrypt.compareSync(password, user.password_hash)) {
            req.session.userId = user.user_id; // Store the user ID in the session
            return res.redirect('/dashboard');
        } else {
            return res.render('login', { error: 'Invalid username or password' });
        }
    });
});

module.exports = router;
