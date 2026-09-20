const Mission = require('../models/Mission');
const MissionResult = require('../models/MissionResult');
const User = require('../models/User');
const gamification = require('../utils/gamification');

// @desc    Get all published missions
// @route   GET /api/missions
// @access  Public
const getMissions = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const missions = await Mission.find(query).select(
      'title slug description category difficulty estimatedTime xpReward'
    );

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mission by ID
// @route   GET /api/missions/:id
// @access  Public (or could be Private depending on requirements, assuming public to read scenario)
const getMissionById = async (req, res, next) => {
  try {
    const missionId = req.params.id;
    if (!missionId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      return next(new Error('Invalid mission ID'));
    }

    const mission = await Mission.findById(missionId);

    if (!mission || !mission.isPublished) {
      res.status(404);
      return next(new Error('Mission not found'));
    }

    // We must return the mission without correct answers and explanations
    const missionData = mission.toObject();
    
    // Explicit sanitization just to be absolutely certain
    if (missionData.questions) {
      missionData.questions = missionData.questions.map(q => {
        delete q.correctAnswer;
        delete q.explanation;
        return q;
      });
    }
    
    res.status(200).json({
      success: true,
      data: missionData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit mission answers
// @route   POST /api/missions/:id/submit
// @access  Private
const submitMission = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionId, answer }]
    
    if (!answers || !Array.isArray(answers)) {
      res.status(400);
      return next(new Error('Invalid answers format'));
    }

    // Need to select correctAnswer and explanation to validate
    const mission = await Mission.findById(req.params.id).select('+questions.correctAnswer +questions.explanation');

    if (!mission) {
      res.status(404);
      return next(new Error('Mission not found'));
    }

    let score = 0;
    let correctAnswersCount = 0;
    const totalQuestions = mission.questions.length;
    const maxScore = mission.questions.reduce((acc, q) => acc + q.points, 0);

    const processedAnswers = [];
    const feedback = [];

    // Evaluate answers
    mission.questions.forEach((question) => {
      const submittedAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
      
      let isCorrect = false;
      let userAnswerText = submittedAnswer ? submittedAnswer.answer : null;

      // Strict Validation: Ensure submitted answer value is a valid option for this question
      if (userAnswerText !== null) {
        const isValidOption = question.options.some(opt => opt.value === userAnswerText);
        if (!isValidOption) {
          throw new Error(`Invalid answer value submitted for question ${question._id}`);
        }
      }

      if (submittedAnswer && submittedAnswer.answer === question.correctAnswer) {
        isCorrect = true;
        score += question.points;
        correctAnswersCount++;
      }

      processedAnswers.push({
        questionId: question._id,
        answer: userAnswerText || '',
        isCorrect,
      });

      feedback.push({
        questionId: question._id,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        pointsAwarded: isCorrect ? question.points : 0,
      });
    });

    // Calculate XP
    const percentage = maxScore > 0 ? (score / maxScore) : 0;
    let xpEarned = Math.round(percentage * mission.xpReward);

    // Check if it's the first time completing this mission
    const previousAttempts = await MissionResult.countDocuments({
      userId: req.user._id,
      missionId: mission._id
    });

    const isReplay = previousAttempts > 0;
    if (isReplay) {
      xpEarned = 0; // Prevent farming XP
    }

    // Save Result
    const result = await MissionResult.create({
      userId: req.user._id,
      missionId: mission._id,
      score,
      totalQuestions, // mapped to totalQuestions, though schema may differ, let's assume it matches MissionResult.js
      correctAnswers: correctAnswersCount,
      xpEarned,
      answers: processedAnswers,
    });

    // Update User Progress
    let levelUp = false;
    let newAchievements = [];
    let isDailyChallenge = false;

    if (!isReplay) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Daily Challenge logic
        const allMissions = await Mission.find({ isPublished: true }).select('_id');
        const dailyId = gamification.getDailyChallengeId(allMissions.map(m => m._id.toString()));
        
        if (dailyId === mission._id.toString()) {
           const todayStr = new Date().toISOString().split('T')[0];
           if (user.dailyChallengeClaimedDate !== todayStr) {
             isDailyChallenge = true;
             xpEarned += 50; // Bonus XP
             user.dailyChallengeClaimedDate = todayStr;
           }
        }

        user.completedChallenges = (user.completedChallenges || 0) + 1;
        user.totalScore = (user.totalScore || 0) + xpEarned;
        
        // Gamification hooks
        const { level } = gamification.calculateLevel(user.totalScore);
        if (level > (user.level || 1)) {
          levelUp = true;
        }
        user.level = level;
        
        const streakData = gamification.updateStreak(user);
        user.currentStreak = streakData.currentStreak;
        user.longestStreak = streakData.longestStreak;
        user.lastActivityDate = streakData.lastActivityDate;
        
        newAchievements = gamification.checkAchievements(user, mission, percentage * 100);
        user.achievements = [...(user.achievements || []), ...newAchievements];

        // Update skills based on simulationType
        if (mission.simulationType && user.skills) {
          const typeMap = {
            'phishing': 'phishing',
            'password': 'password',
            'network': 'network',
            'malware': 'malware',
            'incident-response': 'incidentResponse'
          };
          const skillKey = typeMap[mission.simulationType];
          if (skillKey) {
            const currentSkill = user.skills[skillKey] || 0;
            const missionScore = percentage * 100;
            // Simple EMA: 70% old, 30% new
            user.skills[skillKey] = Math.round((currentSkill * 0.7) + (missionScore * 0.3));
          }
        }

        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        missionId: mission._id,
        score,
        totalPoints: maxScore,
        correctAnswers: correctAnswersCount,
        totalQuestions,
        xpEarned,
        isReplay,
        levelUp,
        isDailyChallenge,
        newAchievements,
        results: feedback.map(f => ({
          questionId: f.questionId,
          correct: f.isCorrect
        }))
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's mission progress (completed mission IDs)
// @route   GET /api/missions/progress
// @access  Private
const getUserProgress = async (req, res, next) => {
  try {
    const results = await MissionResult.find({ userId: req.user._id }).select('missionId');
    const completedMissionIds = results.map(r => r.missionId);

    res.status(200).json({
      success: true,
      data: {
        completedMissions: completedMissionIds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's result for a specific mission
// @route   GET /api/missions/:id/result
// @access  Private
const getMissionResult = async (req, res, next) => {
  try {
    const missionId = req.params.id;
    if (!missionId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      return next(new Error('Invalid mission ID'));
    }

    const mission = await Mission.findById(missionId).select('+questions.correctAnswer +questions.explanation');
    if (!mission) {
      res.status(404);
      return next(new Error('Mission not found'));
    }

    // Find the latest result for this user and mission
    const result = await MissionResult.findOne({ 
      userId: req.user._id, 
      missionId: mission._id 
    }).sort({ createdAt: -1 });

    if (!result) {
      res.status(404);
      return next(new Error('Result not found'));
    }

    // Attach explanations and correct answers to the result feedback since the user has completed it
    const feedback = result.answers.map(ans => {
      const question = mission.questions.find(q => q._id.toString() === ans.questionId.toString());
      return {
        questionId: ans.questionId,
        questionText: question ? question.questionText : 'Unknown Question',
        userAnswer: ans.answer,
        isCorrect: ans.isCorrect,
        correctAnswer: question ? question.correctAnswer : '',
        explanation: question ? question.explanation : '',
        pointsAwarded: ans.isCorrect ? (question ? question.points : 0) : 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        missionId: result.missionId,
        missionTitle: mission.title,
        missionCategory: mission.category,
        score: result.score,
        totalPoints: mission.questions.reduce((acc, q) => acc + q.points, 0),
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        xpEarned: result.xpEarned,
        completedAt: result.createdAt,
        results: feedback
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get simulation data for a mission
// @route   GET /api/missions/:id/simulation
// @access  Private
const getSimulation = async (req, res, next) => {
  try {
    const missionId = req.params.id;
    if (!missionId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      return next(new Error('Invalid mission ID'));
    }

    const mission = await Mission.findById(missionId).select('+simulationData');

    if (!mission || !mission.isPublished) {
      res.status(404);
      return next(new Error('Mission not found'));
    }

    if (!mission.simulationType || !mission.simulationData) {
      res.status(400);
      return next(new Error('This mission does not contain a simulation.'));
    }

    // toJSON will automatically strip correctDecision, explanation, and points based on our Mission model logic
    const missionData = mission.toJSON();

    res.status(200).json({
      success: true,
      data: missionData.simulationData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit simulation decisions
// @route   POST /api/missions/:id/simulation/submit
// @access  Private
const submitSimulation = async (req, res, next) => {
  try {
    const { decisions } = req.body; // [{ itemId, decision }]
    
    if (!decisions || !Array.isArray(decisions)) {
      res.status(400);
      return next(new Error('Invalid decisions format'));
    }

    const mission = await Mission.findById(req.params.id).select('+simulationData');

    if (!mission || !mission.simulationType || !mission.simulationData) {
      res.status(404);
      return next(new Error('Simulation not found'));
    }

    const simulationItems = mission.simulationData.items;
    if (!simulationItems) {
      res.status(500);
      return next(new Error('Invalid simulation data configuration'));
    }

    let score = 0;
    let correctAnswersCount = 0;
    const totalQuestions = simulationItems.length;
    let maxScore = 0;

    const processedAnswers = [];
    const feedback = [];

    // Evaluate decisions
    simulationItems.forEach((item) => {
      maxScore += item.points || 0;
      const submittedDecision = decisions.find(d => d.itemId === item.id);
      
      let isCorrect = false;
      let userAnswerText = submittedDecision ? submittedDecision.decision : null;

      // Allow any submitted decision as different simulations have different valid decisions, but we validate existence
      if (userAnswerText && typeof userAnswerText !== 'string') {
         throw new Error(`Invalid decision value submitted for item ${item.id}`);
      }

      if (submittedDecision && submittedDecision.decision === item.correctDecision) {
        isCorrect = true;
        score += (item.points || 0);
        correctAnswersCount++;
      }

      processedAnswers.push({
        questionId: item.id, // Re-use questionId for itemId
        answer: userAnswerText || '',
        isCorrect,
      });

      feedback.push({
        questionId: item.id,
        isCorrect,
        correctAnswer: item.correctDecision,
        explanation: item.explanation,
        pointsAwarded: isCorrect ? (item.points || 0) : 0,
        questionText: `Item: ${item.id}`,
      });
    });

    // Calculate XP
    const percentage = maxScore > 0 ? (score / maxScore) : 0;
    let xpEarned = Math.round(percentage * mission.xpReward);

    // Check if it's the first time completing this mission
    const previousAttempts = await MissionResult.countDocuments({
      userId: req.user._id,
      missionId: mission._id
    });

    const isReplay = previousAttempts > 0;
    if (isReplay) {
      xpEarned = 0; // Prevent farming XP
    }

    // Save Result
    const result = await MissionResult.create({
      userId: req.user._id,
      missionId: mission._id,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      xpEarned,
      answers: processedAnswers,
    });

    // Update User Progress
    let levelUp = false;
    let newAchievements = [];
    let isDailyChallenge = false;

    if (!isReplay) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Daily Challenge logic
        const allMissions = await Mission.find({ isPublished: true }).select('_id');
        const dailyId = gamification.getDailyChallengeId(allMissions.map(m => m._id.toString()));
        
        if (dailyId === mission._id.toString()) {
           const todayStr = new Date().toISOString().split('T')[0];
           if (user.dailyChallengeClaimedDate !== todayStr) {
             isDailyChallenge = true;
             xpEarned += 50; // Bonus XP
             user.dailyChallengeClaimedDate = todayStr;
           }
        }

        user.completedChallenges = (user.completedChallenges || 0) + 1;
        user.totalScore = (user.totalScore || 0) + xpEarned;
        
        // Gamification hooks
        const { level } = gamification.calculateLevel(user.totalScore);
        if (level > (user.level || 1)) {
          levelUp = true;
        }
        user.level = level;
        
        const streakData = gamification.updateStreak(user);
        user.currentStreak = streakData.currentStreak;
        user.longestStreak = streakData.longestStreak;
        user.lastActivityDate = streakData.lastActivityDate;
        
        newAchievements = gamification.checkAchievements(user, mission, percentage * 100);
        user.achievements = [...(user.achievements || []), ...newAchievements];

        // Update skills based on simulationType
        if (mission.simulationType && user.skills) {
          const typeMap = {
            'phishing': 'phishing',
            'password': 'password',
            'network': 'network',
            'malware': 'malware',
            'incident-response': 'incidentResponse'
          };
          const skillKey = typeMap[mission.simulationType];
          if (skillKey) {
            const currentSkill = user.skills[skillKey] || 0;
            const missionScore = percentage * 100;
            // Simple EMA: 70% old, 30% new
            user.skills[skillKey] = Math.round((currentSkill * 0.7) + (missionScore * 0.3));
          }
        }

        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        missionId: mission._id,
        score,
        totalPoints: maxScore,
        correctAnswers: correctAnswersCount,
        totalQuestions,
        xpEarned,
        isReplay,
        levelUp,
        isDailyChallenge,
        newAchievements,
        results: feedback
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMissions,
  getMissionById,
  submitMission,
  getUserProgress,
  getMissionResult,
  getSimulation,
  submitSimulation,
};
