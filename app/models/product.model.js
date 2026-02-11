const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        category: {
            type: String,
            enum: ["hot coffee", "iced coffee", "tea", "pastry", "food"],
            required: true
        },
        isAvailable: { type: Boolean, default: true }
    })
);

module.exports = Product;