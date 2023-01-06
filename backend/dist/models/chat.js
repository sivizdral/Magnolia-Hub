"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Chat = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    participant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    workshop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Workshops",
    },
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
});
exports.default = mongoose_1.default.model('ChatModel', Chat, 'Chats');
//# sourceMappingURL=chat.js.map