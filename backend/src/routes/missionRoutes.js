const express = require('express');
const router = express.Router();
const {
  getMissions,
  getMissionById,
  submitMission,
  getUserProgress,
  getMissionResult,
  getSimulation,
  submitSimulation,
} = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getMissions);
router.route('/progress').get(protect, getUserProgress); // Must be above /:id
router.route('/:id').get(getMissionById);
router.route('/:id/submit').post(protect, submitMission);
router.route('/:id/result').get(protect, getMissionResult);
router.route('/:id/simulation').get(protect, getSimulation);
router.route('/:id/simulation/submit').post(protect, submitSimulation);

module.exports = router;
