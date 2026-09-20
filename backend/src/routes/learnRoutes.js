const express = require('express');
const router = express.Router();
const { getLearnTopics, getLearnTopicById } = require('../controllers/learnController');

// Public routes for learning material
router.get('/', getLearnTopics);
router.get('/:id', getLearnTopicById);

module.exports = router;
