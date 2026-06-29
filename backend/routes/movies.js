const express = require('express');
const Movie = require('../models/Movie');
const { protect, requireSubscription, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all movies - public endpoint
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().select(
      'title genre releaseYear rating posterUrl requiredPlan'
    );
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie details - private endpoint
router.get('/:id', protect, requireSubscription, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new movie - admin only
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { title, description, genre, releaseYear, duration, rating, posterUrl, backdropUrl, requiredPlan } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const movie = await Movie.create({
      title,
      description,
      genre: genre || [],
      releaseYear,
      duration,
      rating,
      posterUrl,
      backdropUrl,
      requiredPlan: requiredPlan || 'basic',
    });

    res.status(201).json({ 
      message: 'Movie created successfully', 
      movie 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a movie - admin only
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre, releaseYear, duration, rating, posterUrl, backdropUrl, requiredPlan } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        description,
        genre,
        releaseYear,
        duration,
        rating,
        posterUrl,
        backdropUrl,
        requiredPlan,
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a movie - admin only
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;