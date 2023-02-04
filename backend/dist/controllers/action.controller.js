"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const user_1 = __importDefault(require("../models/user"));
const comment_1 = __importDefault(require("../models/comment"));
const mongoose_1 = __importDefault(require("mongoose"));
class ActionController {
    constructor() {
        this.allWorkshopLikes = (req, res) => {
            let workshop_id = req.query.id.toString();
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ likes: workshop.likes });
            });
        };
        this.like = (req, res) => {
            let workshop_id = req.body.workshop_id.toString();
            let username = req.body.username;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                workshop.likes.push(username);
                console.log(username);
                workshop.save((err, workshop) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user_1.default.find({ 'username': username }, (err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        user = user[0];
                        user.likes.push(new mongoose_1.default.Types.ObjectId(workshop_id));
                        user.save((err, workshop) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            res.status(200).send({ message: "Like successful!" });
                        });
                    });
                });
            });
        };
        this.removeLike = (req, res) => {
            let workshop_id = req.body.workshop_id.toString();
            let username = req.body.username;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let index = workshop.likes.indexOf(username);
                if (index != -1)
                    workshop.likes.splice(index, 1);
                workshop.save((err, workshop) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user_1.default.find({ 'username': username }, (err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        user = user[0];
                        let index = user.likes.indexOf(new mongoose_1.default.Types.ObjectId(workshop_id));
                        if (index != -1)
                            user.likes.splice(index, 1);
                        user.save((err, workshop) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            res.status(200).send({ message: "Unlike successful!" });
                        });
                    });
                });
            });
        };
        this.allWorkshopComments = (req, res) => {
            let workshop_id = req.query.id;
            comment_1.default.find({ 'workshop': workshop_id }, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let photos = [];
                let firstnames = [];
                let ids = [];
                for (let i = 0; i < data.length; i++) {
                    ids.push(data[i].user);
                }
                user_1.default.find({ _id: { $in: ids } }, (err, users) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    for (let i = 0; i < ids.length; i++) {
                        for (let j = 0; j < users.length; j++) {
                            if (ids[i].equals(users[j]._id)) {
                                photos.push(users[j].photo[0].path);
                                firstnames.push(users[j].firstname);
                                break;
                            }
                        }
                    }
                    res.send({ 'comments': data, 'firstnames': firstnames, 'photos': photos });
                });
            });
        };
        this.postComment = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let user_id = req.body.user_id;
            let text = req.body.text;
            let newComment = new comment_1.default({
                workshop: workshop_id,
                user: user_id,
                timestamp: Date.now(),
                text: text
            });
            newComment.save((err, comment) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "Comment was added successfully!" });
            });
        };
    }
}
exports.ActionController = ActionController;
//# sourceMappingURL=action.controller.js.map