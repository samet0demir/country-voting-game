const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const auth = require('../middleware/auth');

// @route   GET api/countries
// @desc    Get all countries
// @access  Public
router.get('/', countryController.getAllCountries);

// @route   POST api/countries/vote
// @desc    Vote for a country
// @access  Private
router.post('/vote', auth, countryController.voteForCountry);

// @route   GET api/countries/stats
// @desc    Get voting statistics
// @access  Public
router.get('/stats', countryController.getVotingStats);

// @route   GET api/countries/check-voted
// @desc    Check if user has voted today
// @access  Private
router.get('/check-voted', auth, countryController.checkVoted);

module.exports = router;