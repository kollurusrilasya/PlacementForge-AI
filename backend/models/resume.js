const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resumeUrl: {
        type: String,
        required: true
    },

    resumeText: {
        type: String,
        default: ""
    }
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;