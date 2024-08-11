const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { generateTokenAndSetCookie } = require('./utils');

const app = express();
const port = 3001;

// Set up CORS with specific origin and credentials
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


app.use(cookieParser());
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

        // Get the newly created user ID
        const userId = result.insertId;
        const newUser = { id: userId, email }; // Construct user object

        // Use the utility function to generate token and set cookie
        generateTokenAndSetCookie(res, newUser);
        console.log('User registered successfully')


        // Add default checklist items
        const basicItems = [
          'Passport', 'Visa', 'Tickets for airline',
          'Copies of passport', 'Drivers licence',
          'Health insurance card', 'List of medications',
          'Travel insurance',
          'Itinerary', 'Maps and directions', 'Language guide', 'Travel guide',
          'Foreign currency', 'Emergency money',
          'Credit card, debit card', 'Cellphone, charger',
        ];

        // Insert default checklist items
        const insertItemsQuery = 'INSERT INTO checklist (user_id, item, is_checked) VALUES ?';
        const itemsValues = basicItems.map(item => [userId, item, false]);

        db.query(insertItemsQuery, [itemsValues], (err) => {
          if (err) {
            console.error('Error inserting default checklist items:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          return res.status(201).json({ message: 'User registered successfully' });
        });
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

      // Use the utility function to generate token and set cookie
      generateTokenAndSetCookie(res, user);

      return res.status(200).json({ message: 'Sign in successful' });
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.clearCookie('authtoken', {
    httpOnly: true,
    secure: false, // Set to true if you're using HTTPS
    sameSite: 'Strict',
    path: '/', // Ensure the path matches where the cookie was set
  });
  return res.status(200).json({ message: 'Logout successful in server.js' });
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

// Add checklist item route
app.post('/api/add-checklist-item', (req, res) => {
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
        console.error('Error inserting checklist item:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.json({ message: 'Item added to checklist' });
    });
  });
});

// Get checklist items route
app.get('/api/get-checklist-items', (req, res) => {
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
        console.error('Error retrieving checklist items:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.json({ checklistItems: results });
    });
  });
});

// Update checklist item state route
app.put('/api/update-checklist-item', (req, res) => {
  const { item, is_checked } = req.body; // Destructuring item and is_checked from the request body
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
        console.error('Error updating checklist item:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.json({ message: 'Item updated successfully' });
    });
  });
});

// Delete checklist item route
app.delete('/api/delete-checklist-item', (req, res) => {
  const { item } = req.body; // Destructure item from the request body
  const token = req.cookies.authtoken;
  console.log(`Delete button clicked with request body:`, req.body); // Log the entire request body, can delete after
  if (!token) {
    console.log('Unauthorized access attempt when deleting checklist item.');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Invalid token when trying to delete checklist item.');
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = decoded.id;
    if (!item) {
      console.error('Item is missing in the request body.');
      return res.status(400).json({ error: 'Item is required' });
    }
    // SQL query to delete the item based on item text
    const deleteItemQuery = 'DELETE FROM checklist WHERE item = ? AND user_id = ?';
    db.query(deleteItemQuery, [item, userId], (err) => {
      if (err) {
        console.error('Error deleting checklist item:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log(`Item with text: '${item}' successfully deleted from the database.`); // Log when item is deleted
      return res.json({ message: 'Checklist item deleted' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
