const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nimama',
  database: 'agile_database',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

const JWT_SECRET = 'your_jwt_secret_key';

// Sign up route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(userExistsQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error checking if user exists:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Sign in route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(userExistsQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error checking if user exists:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Sign in successful', token });
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
