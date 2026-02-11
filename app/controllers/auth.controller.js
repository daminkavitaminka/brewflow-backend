const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role || "customer"
    });

    user.save()
        .then(user => {
            res.send({ message: "User was registered successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


exports.signin = (req, res) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }


            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }


            var token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
                expiresIn: 86400
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err });
        });
};