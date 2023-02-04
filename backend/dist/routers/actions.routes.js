"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const action_controller_1 = require("../controllers/action.controller");
const actionsRouter = express_1.default.Router();
actionsRouter.route('/allWorkshopLikes').get((req, res) => new action_controller_1.ActionController().allWorkshopLikes(req, res));
actionsRouter.route('/like').post((req, res) => new action_controller_1.ActionController().like(req, res));
actionsRouter.route('/removeLike').post((req, res) => new action_controller_1.ActionController().removeLike(req, res));
actionsRouter.route('/allWorkshopComments').get((req, res) => new action_controller_1.ActionController().allWorkshopComments(req, res));
actionsRouter.route('/comment').post((req, res) => new action_controller_1.ActionController().postComment(req, res));
exports.default = actionsRouter;
//# sourceMappingURL=actions.routes.js.map