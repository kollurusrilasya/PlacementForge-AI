const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resumeUrl: {
        type: String,
        default: ""
    },

    resumeText: {
        type: String,
        default: ""
    },

    resumeData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;