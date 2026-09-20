const User = require('../models/User');
const MissionResult = require('../models/MissionResult');
const Mission = require('../models/Mission');
const gamification = require('../utils/gamification');

// @desc    Get user gamification progress
// @route   GET /api/users/me/progress
// @access  Private
const getMyProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      'username totalScore completedChallenges level currentStreak longestStreak lastActivityDate achievements dailyChallengeClaimedDate'
    );

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const { nextLevelXP } = gamification.calculateLevel(user.totalScore);
    
    // Check if daily challenge claimed today
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyChallengeClaimed = user.dailyChallengeClaimedDate === todayStr;

    res.status(200).json({
      success: true,
      data: {
        totalXP: user.totalScore,
        level: user.level,
        nextLevelXP,
        completedMissions: user.completedChallenges,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActivityDate: user.lastActivityDate,
        achievementsUnlocked: user.achievements ? user.achievements.length : 0,
        achievementsTotal: gamification.ACHIEVEMENTS.length,
        achievements: user.achievements || [],
        allAchievements: gamification.ACHIEVEMENTS, // Provide definitions so frontend can render locked/unlocked
        dailyChallengeClaimed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    // Top 10 users by totalScore (XP)
    const users = await User.find({})
      .sort({ totalScore: -1 })
      .limit(10)
      .select('username level totalScore');

    let userRank = null;
    
    // If request has auth headers and user is logged in, find their rank
    if (req.user) {
      const currentUser = await User.findById(req.user._id).select('totalScore');
      if (currentUser) {
        // Find how many users have strictly more score
        const rankAhead = await User.countDocuments({ totalScore: { $gt: currentUser.totalScore } });
        userRank = rankAhead + 1; // 0 people ahead = rank 1
      }
    }

    res.status(200).json({
      success: true,
      data: {
        leaderboard: users.map((u, index) => ({
          rank: index + 1,
          username: u.username,
          level: u.level,
          totalXP: u.totalScore
        })),
        userRank
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily challenge
// @route   GET /api/users/daily-challenge
// @access  Public
const getDailyChallenge = async (req, res, next) => {
  try {
    const allMissions = await Mission.find({ isPublished: true }).select('_id title category difficulty xpReward');
    const dailyId = gamification.getDailyChallengeId(allMissions.map(m => m._id.toString()));

    if (!dailyId) {
      res.status(404);
      return next(new Error('No daily challenge available'));
    }

    const dailyMission = allMissions.find(m => m._id.toString() === dailyId);

    res.status(200).json({
      success: true,
      data: {
        missionId: dailyMission._id,
        title: dailyMission.title,
        category: dailyMission.category,
        difficulty: dailyMission.difficulty,
        bonusXP: 50 // deterministic
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user skills
// @route   GET /api/users/me/skills
// @access  Private
const getMySkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('skills');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const skills = user.skills || {
      phishing: 0,
      password: 0,
      network: 0,
      malware: 0,
      incidentResponse: 0,
    };

    // Calculate recommended difficulty
    const values = Object.values(skills);
    const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
    
    let recommendedDifficulty = 'easy';
    if (avg > 70) recommendedDifficulty = 'hard';
    else if (avg > 40) recommendedDifficulty = 'medium';

    res.status(200).json({
      success: true,
      data: {
        skills,
        recommendedDifficulty
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning recommendations
// @route   GET /api/users/me/recommendations
// @access  Private
const getMyRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('skills');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const skills = user.skills || {
      phishing: 0,
      password: 0,
      network: 0,
      malware: 0,
      incidentResponse: 0,
    };

    // Find lowest skill
    let lowestSkill = 'phishing';
    let lowestScore = skills.phishing;

    for (const [skill, score] of Object.entries(skills)) {
      if (score < lowestScore) {
        lowestScore = score;
        lowestSkill = skill;
      }
    }

    // Mapping skill to readable text
    const skillMap = {
      phishing: 'Phishing Defense',
      password: 'Password Security',
      network: 'Network Defense',
      malware: 'Malware Investigation',
      incidentResponse: 'Incident Response'
    };

    res.status(200).json({
      success: true,
      data: {
        improve: skillMap[lowestSkill],
        reason: `Your recent ${skillMap[lowestSkill].toLowerCase()} missions had lower scores than your other categories.`,
        recommendedTopicId: lowestSkill
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user investigation history
// @route   GET /api/users/me/history
// @access  Private
const getInvestigationHistory = async (req, res, next) => {
  try {
    const history = await MissionResult.find({ userId: req.user._id })
      .populate('missionId', 'title category difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProgress,
  getLeaderboard,
  getDailyChallenge,
  getMySkills,
  getMyRecommendations,
  getInvestigationHistory
};
