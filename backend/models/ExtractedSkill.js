const mongoose = require("mongoose");

const extractedSkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    skill: {
        type: String,
        required: true
    }
});

extractedSkillSchema.index(
    { userId: 1, skill: 1 },
    { unique: true }
);

const ExtractedSkill = mongoose.model(
    "ExtractedSkill",
    extractedSkillSchema
);

module.exports = ExtractedSkill;