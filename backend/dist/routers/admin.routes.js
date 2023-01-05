"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const adminRouter = express_1.default.Router();
adminRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
adminRouter.route('/getUsers').get((req, res) => new admin_controller_1.AdminController().getAllUsers(req, res));
adminRouter.route('/changeUser').post((req, res) => new admin_controller_1.AdminController().changeUser(req, res));
adminRouter.route('/deleteUser').post((req, res) => new admin_controller_1.AdminController().deleteUser(req, res));
adminRouter.route('/addUser').post((req, res) => new admin_controller_1.AdminController().addUser(req, res));
adminRouter.route('/changeRequestStatus').post((req, res) => new admin_controller_1.AdminController().changeRequestStatus(req, res));
exports.default = adminRouter;
//# sourceMappingURL=admin.routes.js.map