
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: ""
    },
    submittedAt: {
      type: Date
    },
    evaluation: {
        score: {
          type: Number,
          min: 0,
          max: 10
        },
        feedback: {
          type: String,
          default: ""
        },
        strengths: {
          type: [String],
          default: []
        },
        improvements: {
          type: [String],
          default: []
        },
        idealAnswer: {
          type: String,
          default: ""
        }
      }
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    interviewType: {
      type: String,
      enum: ["technical", "coding", "hr"],
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      default: "Medium"
    },
    status: {
        type: String,
        enum: ["in-progress", "completed"],
        default: "in-progress"
      },
      
      questions: [
        {
          questionId: {
            type: String,
            required: true
          },
          question: {
            type: String,
            required: true
          },
          hint: {
            type: String,
            default: ""
          }
        }
      ],
      
      answers: [answerSchema],
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
