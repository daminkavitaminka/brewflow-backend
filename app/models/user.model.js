const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Will be hashed
        role: {
            type: String,
            enum: ["customer", "barista", "admin"],
            default: "customer"
        },
        createdAt: { type: Date, default: Date.now }
    })
);

module.exports = User;