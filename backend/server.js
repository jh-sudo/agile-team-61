const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3001;

// Set up CORS with specific origin and credentials
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

        // Add logic to create the default checklist items for the user here

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
      
      // Set the JWT as a cookie
      res.cookie('authtoken', token, { httpOnly: true, secure: false, sameSite: 'Strict' }); // Adjust 'secure' depending on environment
      return res.status(200).json({ message: 'Sign in successful' });
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Token verification route
app.get('/api/verifyToken', (req, res) => {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(200).json({ message: 'Token is valid' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
