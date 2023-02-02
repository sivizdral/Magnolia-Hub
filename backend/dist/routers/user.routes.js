"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const signUpVerification_1 = require("../middleware/signUpVerification");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { cb(null, './uploads/'); },
    filename: function (req, file, cb) { cb(null, Date.now() + file.originalname); }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
const userRouter = express_1.default.Router();
userRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/signup').post(upload.array('photo', 1), [new signUpVerification_1.RegisterVerification().checkCorrectUsernameMail], (req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/password-reset').post((req, res) => new user_controller_1.UserController().passwordReset(req, res));
userRouter.route('/password-reset/:userId/:token').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/password-change').post((req, res) => new user_controller_1.UserController().normalChange(req, res));
userRouter.route('/myData').get((req, res) => new user_controller_1.UserController().getMyData(req, res));
userRouter.route('/updateMyData').post((req, res) => new user_controller_1.UserController().updateMyData(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map