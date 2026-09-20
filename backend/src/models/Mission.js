const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice'], // Expandable for later
    default: 'multiple-choice',
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
    select: false, // Don't return this by default when fetching mission
  },
  explanation: {
    type: String,
    required: true,
    select: false, // Don't return explanation until submitted
  },
  points: {
    type: Number,
    default: 100,
  }
});

const missionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    xpReward: {
      type: Number,
      required: true,
      default: 100,
    },
    scenario: {
      type: String,
      required: true,
    },
    objectives: {
      type: [String],
      required: true,
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mission', missionSchema);
