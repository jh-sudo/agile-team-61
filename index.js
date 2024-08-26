const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// SQLite database setup
const dbFilePath = './database.db';
global.db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit if database connection fails
    } else {
        console.log("Database connected");
        db.run("PRAGMA foreign_keys=ON"); // Enable foreign key constraints
    }
});

// Add the login routes
const loginRoutes = require('./routes/login');
app.use(loginRoutes);

// Add the users routes
const usersRoutes = require('./routes/users');
app.use(usersRoutes);

// Add the dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use(dashboardRoutes);

// Root route - render the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
