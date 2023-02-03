"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const chatsRouter = express_1.default.Router();
chatsRouter.route('/userChat').get((req, res) => new chat_controller_1.ChatController().getUserChat(req, res));
chatsRouter.route('/sendMessage').post((req, res) => new chat_controller_1.ChatController().sendMessage(req, res));
exports.default = chatsRouter;
//# sourceMappingURL=chars.routes.js.map