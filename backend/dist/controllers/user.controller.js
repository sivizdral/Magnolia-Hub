"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const token_1 = __importDefault(require("../models/token"));
const nodemailer_1 = __importDefault(require("nodemailer"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const auth_config_1 = require("../config/auth.config");
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            user_1.default.findOne({ 'username': username }, (err, user) => {
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
        this.passwordReset = (req, res) => {
            let email = req.body.email;
            user_1.default.findOne({ 'email': email }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User with given e-mail does not exist." });
                }
                token_1.default.findOne({ 'userId': user._id }).then((token) => {
                    if (!token) {
                        token = new token_1.default({
                            userId: user._id,
                            token: crypto_1.default.randomBytes(32).toString("hex"),
                        }).save();
                    }
                    const link = `localhost:4000/users/password-reset/${user._id}/${token.token}`;
                    try {
                        this.sendEmail(user.email, "Password reset", link);
                        res.send("password reset link sent to your email account");
                    }
                    catch (err) {
                        console.log(err);
                        res.send("an error occured");
                    }
                });
            }));
        };
        this.sendEmail = (email, subject, text) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'magnolia.hub.001@gmail.com',
                        pass: 'fydsynggvtwaelrp',
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                yield transporter.sendMail({
                    from: 'magnolia.hub.001@gmail.com',
                    to: email,
                    subject: subject,
                    text: text,
                });
                console.log("email sent sucessfully");
            }
            catch (error) {
                console.log(error, "email not sent");
            }
        });
        this.changePassword = (req, res) => {
            let password = req.body.password;
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map