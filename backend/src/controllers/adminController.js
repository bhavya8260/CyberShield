const User = require('../models/User');
const Mission = require('../models/Mission');
const MissionResult = require('../models/MissionResult');
const AuditLog = require('../models/AuditLog');

// @desc    Get Admin Dashboard Overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
const getAnalyticsOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActivityDate: { $ne: null } });
    const totalMissions = await Mission.countDocuments();
    const publishedMissions = await Mission.countDocuments({ published: true });
    
    const resultsAgg = await MissionResult.aggregate([
      {
        $group: {
          _id: null,
          totalCompletions: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      }
    ]);
    
    const usersAgg = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: "$totalScore" },
          avgLevel: { $avg: "$level" },
          avgPhishing: { $avg: "$skills.phishing" },
          avgPassword: { $avg: "$skills.password" },
          avgNetwork: { $avg: "$skills.network" },
          avgMalware: { $avg: "$skills.malware" },
          avgIncidentResponse: { $avg: "$skills.incidentResponse" }
        }
      }
    ]);

    const completions = resultsAgg[0] || { totalCompletions: 0, avgScore: 0 };
    const userStats = usersAgg[0] || { totalXP: 0, avgLevel: 1 };

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalMissions,
        publishedMissions,
        totalCompletions: completions.totalCompletions,
        averageScore: Math.round(completions.avgScore),
        totalXP: userStats.totalXP,
        averageLevel: Math.round(userStats.avgLevel),
        averageSkills: {
          phishing: Math.round(userStats.avgPhishing || 0),
          password: Math.round(userStats.avgPassword || 0),
          network: Math.round(userStats.avgNetwork || 0),
          malware: Math.round(userStats.avgMalware || 0),
          incidentResponse: Math.round(userStats.avgIncidentResponse || 0),
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status/role
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (role) {
      user.role = role;
    }
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();
    
    // Log action
    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: user._id.toString(),
      metadata: { newRole: role, isActive }
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all missions (admin view)
// @route   GET /api/admin/missions
// @access  Private/Admin
const getAdminMissions = async (req, res, next) => {
  try {
    // Return all missions, including unpublished and sensitive data
    const missions = await Mission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: missions.length, data: missions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
const getAuditLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const logs = await AuditLog.find().populate('userId', 'username email').sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    System health
// @route   GET /api/admin/health
// @access  Private/Admin
const getHealthStatus = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        status: 'UP',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview,
  getUsers,
  updateUser,
  getAdminMissions,
  getAuditLogs,
  getHealthStatus
};
