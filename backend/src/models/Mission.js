const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice'],
    default: 'multiple-choice',
  },
  options: [
    {
      text: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  correctAnswer: {
    type: String,
    required: true,
    select: false, // Security: do not send to frontend by default
  },
  explanation: {
    type: String,
    required: true,
    select: false, // Security: do not send explanation by default
  },
  points: {
    type: Number,
    default: 10,
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
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    estimatedTime: {
      type: Number,
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
    questions: {
      type: [questionSchema],
      default: [],
    },
    simulationType: {
      type: String,
      enum: ['phishing', 'password', 'network', 'malware', 'incident-response', null],
      default: null,
    },
    simulationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false, // Security: don't expose without explicit .select('+simulationData')
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add toJSON method to ensure hidden fields are removed when returning mission objects
missionSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    if (ret.questions) {
      ret.questions.forEach(q => {
        delete q.correctAnswer;
        delete q.explanation;
      });
    }
    
    // Scrutinize simulation data if it leaked into JSON
    if (ret.simulationData && ret.simulationData.items) {
      ret.simulationData.items.forEach(item => {
        delete item.correctDecision;
        delete item.explanation;
        delete item.points;
      });
    }
    return ret;
  }
});

module.exports = mongoose.model('Mission', missionSchema);
