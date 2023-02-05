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
const mongodb_1 = require("mongodb");
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
                    accessToken: token,
                    photo: user.photo,
                    firstname: user.firstname,
                    lastname: user.lastname
                });
            });
        };
        this.register = (req, res) => {
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password, 8);
            let email = req.body.email;
            let type = req.body.type;
            let firstname = req.body.firstname;
            let lastname = req.body.lastname;
            let status = "unapproved";
            let phone = req.body.phone;
            let organizationName = req.body.organizationName;
            let organizationAddress = req.body.organizationAddress;
            let taxNumber = req.body.taxNumber;
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (user) {
                    return res.status(404).send({ message: "Username already taken!" });
                }
                user_1.default.findOne({ 'email': email }, (err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    if (user) {
                        return res.status(404).send({ message: "Email already taken!" });
                    }
                    const userNew = new user_1.default({
                        username: username,
                        password: password,
                        email: email,
                        type: type,
                        firstname: firstname,
                        lastname: lastname,
                        status: status,
                        phone: phone,
                        orgData: {
                            organizationName: organizationName,
                            organizationAddress: organizationAddress,
                            taxNumber: taxNumber
                        },
                        likes: [],
                        comments: [],
                        pastWorkshops: [],
                        pendingWorkshops: [],
                        photo: req.files
                    });
                    userNew.save((err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            });
        };
        this.passwordReset = (req, res) => {
            let email = req.body.email;
            console.log("ENTERED");
            user_1.default.findOne({ 'email': email }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User with given e-mail does not exist." });
                }
                token_1.default.findOne({ 'userId': user._id }, (err, token) => {
                    if (!token) {
                        token = new token_1.default({
                            userId: user._id,
                            token: crypto_1.default.randomBytes(32).toString("hex"),
                        }).save();
                    }
                    const link = `http://localhost:4200/password-reset/${user._id}/${token.token}`;
                    try {
                        this.sendEmail(user.email, "Password reset", link);
                        res.status(200).send("password reset link sent to your email account");
                    }
                    catch (err) {
                        console.log(err);
                        res.status(400).send("an error occured");
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
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let password = req.body.password;
                console.log("CHANGE");
                console.log(req.params);
                const user = yield user_1.default.findById(req.params.userId);
                if (!user)
                    return res.status(400).send({ message: "invalid link or expired" });
                const token = yield token_1.default.findOne({
                    userId: user._id,
                    token: req.params.token,
                });
                if (!token)
                    return res.status(400).send({ message: "Invalid link or expired" });
                user.password = bcrypt.hashSync(password, 8);
                yield user.save();
                yield token.delete();
                res.send({ message: "password reset sucessfully." });
            }
            catch (error) {
                res.send({ message: "An error occured" });
                console.log(error);
            }
        });
        this.normalChange = (req, res) => {
            let username = req.body.username;
            let oldPass = req.body.oldPass;
            let newPass = req.body.newPass;
            console.log(username, oldPass, newPass);
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                if (!bcrypt.compareSync(oldPass, user.password)) {
                    return res.status(401).send({
                        message: "Old password is not correct!"
                    });
                }
                user.password = bcrypt.hashSync(newPass, 8);
                user.save();
                res.send({ message: "Password changed successfully!" });
            });
        };
        this.getMyData = (req, res) => {
            let user_id = req.query.user_id;
            let id = new mongodb_1.ObjectId(user_id.toString());
            user_1.default.findById(id, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                if (user.type === "participant" || user.type === "admin") {
                    res.status(200).send({
                        user_id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        photo: user.photo
                    });
                    return;
                }
                else if (user.type === "organizer") {
                    res.status(200).send({
                        user_id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        orgData: user.orgData,
                        photo: user.photo
                    });
                    return;
                }
            });
        };
        this.updateMyData = (req, res) => {
            let user_id = req.body.user_id;
            let changedFields = req.body.changedFields;
            user_1.default.findByIdAndUpdate(user_id, changedFields, { new: true }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                res.status(200).send({ message: "User data successfully updated!" });
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map