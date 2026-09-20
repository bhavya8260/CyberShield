const express = require('express');
const router = express.Router();
const {
  getMissions,
  getMissionById,
  submitMission,
} = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getMissions);
router.route('/:id').get(getMissionById);
router.route('/:id/submit').post(protect, submitMission);

module.exports = router;
