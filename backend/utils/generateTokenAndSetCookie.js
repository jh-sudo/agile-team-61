const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

function generateTokenAndSetCookie(res, user) {
    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Log the token
    console.log('Generated Token:', token);
    
    // Set the cookie
    res.cookie('authtoken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
      });
    
    // Log cookies set
    console.log('Cookies Set:', res.getHeader('Set-Cookie'));
  }  

module.exports = { generateTokenAndSetCookie };
