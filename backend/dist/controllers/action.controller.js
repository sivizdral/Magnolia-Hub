"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
class ActionController {
    constructor() {
        this.allWorkshopLikes = (req, res) => {
            let workshop_id = req.query.id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ likes: workshop.likes });
            });
        };
        this.like = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let username = req.body.username;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                workshop.likes.push(username);
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
                        user.likes.push(new mongoose_1.default.Types.ObjectId(workshop_id));
                        user.save((err, workshop) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            res.send("Like successful!");
                        });
                    });
                });
            });
        };
    }
}
exports.ActionController = ActionController;
//# sourceMappingURL=action.controller.js.map