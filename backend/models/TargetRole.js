const mongoose = require("mongoose");

const targetRoleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    role: {
        type: String,
        required: true
    },

    targetPackage: {
        type: Number,
        default: null
    }
});

const TargetRole = mongoose.model(
    "TargetRole",
    targetRoleSchema
);

module.exports = TargetRole;