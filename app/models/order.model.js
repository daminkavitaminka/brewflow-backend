const mongoose = require("mongoose");

const Order = mongoose.model(
    "Order",
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, default: 1 }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "brewing", "ready", "completed", "cancelled"],
            default: "pending"
        },
        createdAt: { type: Date, default: Date.now }
    })
);

module.exports = Order;