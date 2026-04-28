const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token and checks tokenVersion to support
 * immediate invalidation on password change / forced logout.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check tokenVersion — if user changed password, all old tokens are invalid
    const user = await User.findById(decoded.id).select('tokenVersion role name email avatar').lean();
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};
