const mongoose = require('mongoose');

// Define Movie schema
const movieSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  genre: [String], // Array of genres
  releaseYear: Number,
  duration: String, // Example: "2h 15m"
  rating: Number, // Example: 8.5
  posterUrl: String, // Movie poster image URL
  backdropUrl: String, // Background image URL
  requiredPlan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic',
  },
}, { timestamps: true });

// Create and export Movie model
module.exports = mongoose.model('Movie', movieSchema);