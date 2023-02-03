"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const action_controller_1 = require("../controllers/action.controller");
const actionsRouter = express_1.default.Router();
actionsRouter.route('/allWorkshopLikes').get((req, res) => new action_controller_1.ActionController().allWorkshopLikes(req, res));
exports.default = actionsRouter;
//# sourceMappingURL=actions.routes.js.map