const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    targetRole: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    roadmap: {
        type: [String],
        default: []
    }
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

module.exports = Roadmap;