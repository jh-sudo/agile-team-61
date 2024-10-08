const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';

// Sign up route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(userExistsQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred while checking user existence' });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error occurred while creating user' });
        }

        const userId = result.insertId;
        const newUser = { id: userId, email };

        // Generate token with expiration
        generateTokenAndSetCookie(res, newUser);

        // Insert basic checklist items
        const basicItems = [
          'Passport', 'Visa', 'Tickets for airline',
          'Copies of passport', 'Drivers licence',
          'Health insurance card', 'List of medications',
          'Travel insurance',
          'Itinerary', 'Maps and directions', 'Language guide', 'Travel guide',
          'Foreign currency', 'Emergency money',
          'Credit card, debit card', 'Cellphone, charger',
        ];
        const insertItemsQuery = 'INSERT INTO checklist (user_id, item, is_checked) VALUES ?';
        const itemsValues = basicItems.map(item => [userId, item, false]);
        db.query(insertItemsQuery, [itemsValues], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error occurred while inserting checklist items' });
          }
          return res.status(201).json({ message: 'User registered successfully' });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error occurred during sign-up' });
  }
});

// Sign in route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(userExistsQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred while checking user existence' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = results[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate token with expiration
      generateTokenAndSetCookie(res, user);
      return res.status(200).json({ message: 'Sign in successful' });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error occurred during sign-in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('authtoken', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
    path: '/',
  });
  return res.status(200).json({ message: 'Logout successful' });
});

// Token verification route
router.get('/verifyToken', (req, res) => {
  const token = req.cookies.authtoken;
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    return res.status(200).json({ message: 'Token is valid' });
  });
});

module.exports = router;
