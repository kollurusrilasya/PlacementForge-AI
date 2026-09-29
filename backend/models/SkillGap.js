const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    targetRole: {
        type: String,
        required: true
    },

    requiredSkills: {
        type: [String],
        default: []
    },

    userSkills: {
        type: [String],
        default: []
    },

    missingSkills: {
        type: [String],
        default: []
    }
});

const SkillGap = mongoose.model("SkillGap", skillGapSchema);

module.exports = SkillGap;