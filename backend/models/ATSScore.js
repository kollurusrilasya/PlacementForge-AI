const mongoose = require("mongoose");

const atsScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    targetRole: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    categoryScores: [
      {
        category: String,
        score: Number,
        maxScore: Number
      }
    ],
    matchedKeywords: [String],
    missingKeywords: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ATSScore", atsScoreSchema);