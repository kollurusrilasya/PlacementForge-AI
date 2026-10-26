const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
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
skillSchema.index({ userId: 1, skill: 1 }, { unique: true });
const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;