// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Connect to MongoDB FIRST
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    // Load API Routes AFTER MongoDB connection
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/movies', require('./routes/movies'));
    app.use('/api/subscription', require('./routes/subscription'));
    
    console.log('✅ Routes loaded');
    
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });