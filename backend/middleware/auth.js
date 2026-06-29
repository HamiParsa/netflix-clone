const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const requireSubscription = (req, res, next) => {
  const { subscription } = req.user;
  
  if (!subscription || subscription.plan === 'none') {
    return res.status(403).json({ message: 'Subscription required' });
  }

  if (new Date(subscription.expiresAt) < new Date()) {
    return res.status(403).json({ message: 'Subscription expired' });
  }

  next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, requireSubscription, requireAdmin };