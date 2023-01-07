"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const signUpVerification_1 = require("../middleware/signUpVerification");
const userRouter = express_1.default.Router();
userRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/signup').post([new signUpVerification_1.RegisterVerification().checkCorrectUsernameMail], (req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/password-reset').post((req, res) => new user_controller_1.UserController().passwordReset(req, res));
userRouter.route('/password-reset/:userId/:token').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/password-change').post((req, res) => new user_controller_1.UserController().normalChange(req, res));
userRouter.route('/myData').get((req, res) => new user_controller_1.UserController().getMyData(req, res));
userRouter.route('/updateMyData').post((req, res) => new user_controller_1.UserController().updateMyData(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map