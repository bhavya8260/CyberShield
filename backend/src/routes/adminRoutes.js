const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const {
  getAnalyticsOverview,
  getUsers,
  updateUser,
  getAdminMissions,
  getAuditLogs,
  getHealthStatus
} = require('../controllers/adminController');

// All admin routes must be protected and require admin role
router.use(protect);
router.use(requireAdmin);

router.get('/analytics/overview', getAnalyticsOverview);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.get('/missions', getAdminMissions);
router.get('/audit-logs', getAuditLogs);
router.get('/health', getHealthStatus);

module.exports = router;
