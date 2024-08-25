const jwt = require('jsonwebtoken');

// Middleware to authenticate the user via JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken; // or wherever you store the token

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed');
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Add the user data to the request object
    next();
  });
}

module.exports = authenticateToken;
