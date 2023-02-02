"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
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
const adminRouter = express_1.default.Router();
adminRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
adminRouter.route('/getUsers').get((req, res) => new admin_controller_1.AdminController().getAllUsers(req, res));
adminRouter.route('/changeUser').post((req, res) => new admin_controller_1.AdminController().changeUser(req, res));
adminRouter.route('/deleteUser').post((req, res) => new admin_controller_1.AdminController().deleteUser(req, res));
adminRouter.route('/addUser').post(upload.array('photo', 1), (req, res) => new admin_controller_1.AdminController().addUser(req, res));
adminRouter.route('/changeRequestStatus').post((req, res) => new admin_controller_1.AdminController().changeRequestStatus(req, res));
exports.default = adminRouter;
//# sourceMappingURL=admin.routes.js.map