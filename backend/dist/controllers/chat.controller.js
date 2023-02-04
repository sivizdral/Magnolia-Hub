"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const mongoose_1 = __importDefault(require("mongoose"));
class ChatController {
    constructor() {
        this.getUserChat = (req, res) => {
            let user_id = req.query.user_id.toString();
            let workshop_id = req.query.workshop_id.toString();
            let organizer_id = req.query.organizer_id.toString();
            chat_1.default.find({ 'participant': user_id, 'workshop': workshop_id }, (err, chat) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (chat.length == 0) {
                    console.log("HERE2");
                    const newChat = new chat_1.default({
                        participant: new mongoose_1.default.Types.ObjectId(user_id),
                        organizer: new mongoose_1.default.Types.ObjectId(organizer_id),
                        workshop: new mongoose_1.default.Types.ObjectId(workshop_id),
                        messages: []
                    });
                    console.log(newChat);
                    newChat.save((err, chat) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send([chat]);
                    });
                }
                else
                    res.send(chat);
            });
        };
        this.sendMessage = (req, res) => {
            let user_id = req.body.user_id;
            let workshop_id = req.body.workshop_id;
            let text = req.body.text;
            let sender = req.body.sender;
            let timestamp = Date.now();
            chat_1.default.find({ 'participant': user_id, 'workshop': workshop_id }, (err, chat) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (chat.length == 0) {
                    res.status(500).send({ message: "Chat not found!" });
                    return;
                }
                let message = {
                    text: text,
                    sender: sender,
                    timestamp: timestamp
                };
                chat = chat[0];
                chat.messages.push(message);
                chat.save((err, chat) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    return res.send({ message: "Message sent!" });
                });
            });
        };
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map