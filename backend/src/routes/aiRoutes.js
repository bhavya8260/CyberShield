const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Private route, only authenticated users can use the AI assistant
router.post('/chat', protect, chatWithAI);

module.exports = router;
