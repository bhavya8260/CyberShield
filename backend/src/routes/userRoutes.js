const express = require('express');
const router = express.Router();

const { getMyProgress, getLeaderboard, getDailyChallenge, getMySkills, getMyRecommendations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get progress requires authentication
router.get('/me/progress', protect, getMyProgress);

// Skills and Recommendations
router.get('/me/skills', protect, getMySkills);
router.get('/me/recommendations', protect, getMyRecommendations);

// Public (with optional auth mapping inside the controller)
router.get('/leaderboard', protect, getLeaderboard);
router.get('/daily-challenge', getDailyChallenge);

module.exports = router;
