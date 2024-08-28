const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const itineraryHomeRoutes = require('./routes/itineraryHomeRoutes');
const editItineraryRoutes = require('./routes/editItineraryRoutes');

const db = require('./db');
const app = express();

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Route setup
app.use('/api', authRoutes);
app.use('/api', checklistRoutes);
app.use('/api', itineraryHomeRoutes);
app.use('/api', editItineraryRoutes);

// Starting the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
