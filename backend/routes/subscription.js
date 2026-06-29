const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Plans information with duration in days
const plans = {
  basic:    { duration: 30,  label: 'Basic' },
  standard: { duration: 30,  label: 'Standard' },
  premium:  { duration: 30,  label: 'Premium' },
};

// Activate subscription endpoint - POST /api/subscription/activate
// User just clicks on plan, no payment required
router.post('/activate', protect, async (req, res) => {
  try {
    const { plan } = req.body;

    // Validate plan
    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plans[plan].duration);

    // Update user subscription
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription: { plan, expiresAt } },
      { new: true }
    );

    // Generate new token with updated subscription
    const newToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        subscription: user.subscription 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      message: `${plans[plan].label} plan activated!`, 
      token: newToken, 
      subscription: user.subscription 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;