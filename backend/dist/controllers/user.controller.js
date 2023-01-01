"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const auth_config_1 = require("../config/auth.config");
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username, 'password': password }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }
                var token = jwt.sign({ id: user.id }, new auth_config_1.Config().secret, {
                    expiresIn: 86400
                });
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    type: user.type,
                    accessToken: token
                });
            });
        };
        this.register = (req, res) => {
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password, 8);
            let email = req.body.email;
            let type = req.body.type;
            const user = new user_1.default({
                username: username,
                password: password,
                email: email,
                type: type,
                firstname: "Pera",
                lastname: "Peric"
            });
            user.save((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "User was registered successfully!" });
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map