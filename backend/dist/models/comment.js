"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Comment = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    workshopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Workshops"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model('CommentModel', Comment, 'Comments');
//# sourceMappingURL=comment.js.map