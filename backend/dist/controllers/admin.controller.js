"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_1 = __importDefault(require("../models/user"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
class AdminController {
    constructor() {
        this.getAllUsers = (req, res) => {
            user_1.default.find((err, users) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                users.forEach(user => jsonArr.push(user.toJSON()));
                res.status(200).send(jsonArr);
            });
        };
        this.changeUser = (req, res) => {
            let changedFields = req.body.changedFields;
            let user_id = req.body.user_id;
            user_1.default.findByIdAndUpdate(user_id, changedFields, { new: true }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(200).send(user);
            });
        };
        this.deleteUser = (req, res) => {
            let username = req.body.username;
            user_1.default.findOneAndDelete({ 'username': username }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(200).send(user);
            });
        };
        this.addUser = (req, res) => {
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password, 8);
            let email = req.body.email;
            let type = req.body.type;
            let firstname = req.body.firstname;
            let lastname = req.body.lastname;
            let status = "approved";
            let phone = req.body.phone;
            let organizationName = req.body.organizationName;
            let organizationAddress = req.body.organizationAddress;
            let taxNumber = req.body.taxNumber;
            user_1.default.findOne({ 'email': email }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (user) {
                    res.status(500).send({ message: "This email already has an account linked to it!" });
                    return;
                }
                user_1.default.findOne({ 'username': username }, (err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    if (user) {
                        res.status(500).send({ message: "This username is already taken!" });
                        return;
                    }
                    const newUser = new user_1.default({
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
                    newUser.save((err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({ message: "User was added successfully!" });
                    });
                });
            });
        };
        this.changeRequestStatus = (req, res) => {
            let status = req.body.status;
            let username = req.body.username;
            user_1.default.findOne({ 'username': username }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    res.status(500).send({ message: "User does not exist!" });
                    return;
                }
                user.status = status;
                user.save((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User status was changed successfully!" });
                });
            });
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map