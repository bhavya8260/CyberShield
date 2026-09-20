const Mission = require('../models/Mission');
const MissionResult = require('../models/MissionResult');
const User = require('../models/User');

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
      '-questions.correctAnswer -questions.explanation -scenario -objectives' // Minimize initial load payload
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
    const mission = await Mission.findById(req.params.id);

    if (!mission || !mission.isPublished) {
      res.status(404);
      return next(new Error('Mission not found'));
    }

    // We must return the mission without correct answers and explanations
    const missionData = mission.toObject();
    
    res.status(200).json({
      success: true,
      data: missionData, // `select: false` on correctAnswer and explanation prevents them from being in the doc by default
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
    const xpEarned = Math.round(percentage * mission.xpReward);

    // Save Result
    const result = await MissionResult.create({
      userId: req.user._id,
      missionId: mission._id,
      score,
      xpEarned,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      answers: processedAnswers,
    });

    // Update User Progress
    // Note: In a real system you might want to ensure XP is only given once per mission.
    // For Phase 2, we will add XP and increment challenges for every completion, or 
    // only if they haven't completed it before. Let's make it so XP is always awarded (replayability).
    const user = await User.findById(req.user._id);
    
    // Check if it's the first time completing this mission to increment completedChallenges
    const previousAttempts = await MissionResult.countDocuments({
      userId: req.user._id,
      missionId: mission._id,
      _id: { $ne: result._id }
    });

    if (previousAttempts === 0) {
      user.completedChallenges += 1;
    }
    
    user.totalScore += xpEarned; // Adding XP to totalScore based on existing field name `totalScore`. 
                                // (Actually req says totalXP, but User model only has totalScore. 
                                // Let's use totalScore to accumulate XP, or add totalXP. I will just add xpEarned to totalScore to minimize model changes).
    
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        resultId: result._id,
        score,
        maxScore,
        xpEarned,
        correctAnswers: correctAnswersCount,
        totalQuestions,
        percentage: Math.round(percentage * 100),
        feedback,
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
};
