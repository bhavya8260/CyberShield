const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password'); // select password because it is excluded by default

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        await AuditLog.create({
          userId: user._id,
          action: 'LOGIN_FAILURE',
          resource: 'Auth',
          metadata: { reason: 'Account disabled' },
          ipAddress: req.ip
        });
        res.status(403);
        throw new Error('Account disabled. Please contact support.');
      }

      await AuditLog.create({
        userId: user._id,
        action: 'LOGIN_SUCCESS',
        resource: 'Auth',
        ipAddress: req.ip
      });

      res.json({
        success: true,
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      if (user) {
        await AuditLog.create({
          userId: user._id,
          action: 'LOGIN_FAILURE',
          resource: 'Auth',
          metadata: { reason: 'Invalid credentials' },
          ipAddress: req.ip
        });
      }
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      _id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      totalScore: req.user.totalScore,
      completedChallenges: req.user.completedChallenges,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Setup first admin (One-time endpoint)
// @route   POST /api/auth/setup-admin
// @access  Public (only works if 0 admins exist)
const setupAdmin = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    
    // Check if any admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      res.status(403);
      throw new Error('Admin setup is already completed.');
    }

    if (!email || !password || !username) {
      res.status(400);
      throw new Error('Please provide email, password, and username');
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'admin'
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  setupAdmin,
};
