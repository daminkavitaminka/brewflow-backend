const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.role === "admin") {
            next();
            return;
        }
        return res.status(403).send({ message: "Require Admin Role!" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

isBarista = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.role === "barista" || user.role === "admin") {
            next();
            return;
        }
        return res.status(403).send({ message: "Require Barista Role!" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isBarista
};
module.exports = authJwt;