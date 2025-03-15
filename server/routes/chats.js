const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// @route   GET api/chats/country/:country
// @desc    Get chat messages for a country
// @access  Private
router.get('/country/:country', auth, chatController.getCountryChat);

// @route   GET api/chats/global
// @desc    Get global chat messages
// @access  Private
router.get('/global', auth, chatController.getGlobalChat);

// @route   POST api/chats
// @desc    Create a chat message
// @access  Private
router.post('/', auth, chatController.createChatMessage);

module.exports = router;