const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');  // Import db.js
const app = express();

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Login route
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

//Checklist route
const checklistRoutes = require('./routes/checklistRoutes');
app.use('/api', checklistRoutes);

//Dashboard route
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api', dashboardRoutes);

//Past Itineraries route
const ViewPastItinerariesRoutes = require('./routes/ViewPastItinerariesRoutes');
app.use('/api', ViewPastItinerariesRoutes);

// Starting the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
