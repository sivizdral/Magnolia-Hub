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
            return res.status(401).send({ message: "Unauthorized access!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user.type != 0) {
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        }
    });
};

isOrganizer = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user.type != 1) {
            res.status(403).send({ message: "Require Organizer Role!" });
            return;
        }

    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isOrganizer
};
module.exports = authJwt;