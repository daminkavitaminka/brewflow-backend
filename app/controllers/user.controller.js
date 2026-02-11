const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

exports.getProfile = (req, res) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) return res.status(404).send({ message: "User Not found." });

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let updateData = { username, email };


        if (password) {
            updateData.password = bcrypt.hashSync(password, 8);
        }

        const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });

        res.status(200).send({
            message: "Profile updated successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.baristaBoard = (req, res) => {
    res.status(200).send("Barista Content.");
};