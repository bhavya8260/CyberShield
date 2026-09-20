const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const missionResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    missionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    xpEarned: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

// Optional: prevent multiple results for the same mission/user, or keep them to track history.
// For Phase 2, keeping history is fine, we just want to ensure we don't accidentally give XP multiple times 
// without logic. We'll handle this in the controller.

module.exports = mongoose.model('MissionResult', missionResultSchema);
