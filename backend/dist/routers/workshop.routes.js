"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workshop_controller_1 = require("../controllers/workshop.controller");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { cb(null, __dirname); },
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
const workshopRouter = express_1.default.Router();
workshopRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
workshopRouter.route('/create').post(upload.array('photo', 1), (req, res) => new workshop_controller_1.WorkshopController().create(req, res));
workshopRouter.route('/addGallery').post(upload.array('gallery', 5), (req, res) => new workshop_controller_1.WorkshopController().addGallery(req, res));
workshopRouter.route('/all').get((req, res) => new workshop_controller_1.WorkshopController().getAll(req, res));
exports.default = workshopRouter;
//# sourceMappingURL=workshop.routes.js.map