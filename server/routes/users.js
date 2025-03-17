const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  userController.register
);

// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.login
);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT api/users/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, userController.updateProfile);

// @route   GET api/users/voting-history
// @desc    Get user's voting history
// @access  Private
router.get('/voting-history', auth, userController.getVotingHistory);

module.exports = router;