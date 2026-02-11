const db = require("../models");
const Order = db.order;
const Product = db.product;
const User = db.user;
const emailService = require("../utils/emailService"); // Import the email utility

// 1. PLACE A NEW ORDER (Customer) + SMTP EMAIL
exports.create = async (req, res) => {
    try {
        // Calculate total price automatically
        let total = 0;
        for (const item of req.body.items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).send({ message: "Product not found!" });
            total += product.price * item.quantity;
        }

        const order = new Order({
            user: req.userId, // ID extracted from JWT token
            items: req.body.items,
            totalAmount: total,
            status: "pending"
        });

        const savedOrder = await order.save();

        // --- SMTP EMAIL INTEGRATION ---
        // Fetch the user's email address from the database
        const user = await User.findById(req.userId);
        if (user && user.email) {
            // We don't want to block the response if the email is slow, 
            // so we call this without 'await' or handle it in the background
            emailService.sendOrderConfirmation(user.email, savedOrder)
                .then(() => console.log(`Confirmation email sent to ${user.email}`))
                .catch(err => console.error("Email failed to send:", err));
        }
        // ------------------------------

        res.send({ message: "Order placed successfully!", order: savedOrder });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// 2. GET MY ORDERS (Customer)
exports.findMyOrders = (req, res) => {
    Order.find({ user: req.userId })
        .populate("items.product", "name price")
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// 3. GET ALL ORDERS (Barista Dashboard)
exports.findAll = (req, res) => {
    Order.find()
        .populate("user", "username")
        .populate("items.product", "name")
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

// 4. UPDATE ORDER STATUS (Barista)
exports.updateStatus = (req, res) => {
    Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    )
        .then(data => {
            if (!data) res.status(404).send({ message: "Order not found!" });
            else res.send({ message: "Order status updated!", data });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};