"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterVerification = void 0;
const user_1 = __importDefault(require("../models/user"));
class RegisterVerification {
    constructor() {
        this.checkCorrectUsernameMail = (req, res, next) => {
            user_1.default.findOne({
                username: req.body.username
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (user) {
                    res.status(400).send({ message: "This username is already in use!" });
                    return;
                }
                user_1.default.findOne({
                    email: req.body.email
                }).exec((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    if (user) {
                        res.status(400).send({ message: "An account has already been registered using this email!" });
                        return;
                    }
                    next();
                });
            });
        };
    }
}
exports.RegisterVerification = RegisterVerification;
//# sourceMappingURL=signUpVerification.js.map