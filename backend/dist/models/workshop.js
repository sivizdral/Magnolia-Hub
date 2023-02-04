"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Workshop = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    photo: {
        type: Object,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    long_description: {
        type: String,
        required: true
    },
    gallery: {
        type: Array
    },
    status: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    participantsList: [Schema.Types.ObjectId],
    pendingList: [Schema.Types.ObjectId],
    waitingList: [Schema.Types.ObjectId],
    likes: [String],
    comments: [Schema.Types.ObjectId]
});
exports.default = mongoose_1.default.model('WorkshopModel', Workshop, 'Workshops');
//# sourceMappingURL=workshop.js.map