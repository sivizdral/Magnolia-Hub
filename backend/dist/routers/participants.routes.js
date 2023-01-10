"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const participant_controller_1 = require("../controllers/participant.controller");
const participantsRouter = express_1.default.Router();
participantsRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
participantsRouter.route('/myPastWorkshops').get((req, res) => new participant_controller_1.ParticipantController().myPastWorkshops(req, res));
participantsRouter.route('/appliedWorkshops').get((req, res) => new participant_controller_1.ParticipantController().appliedWorkshops(req, res));
participantsRouter.route('/cancelApplication').post((req, res) => new participant_controller_1.ParticipantController().cancelApplication(req, res));
participantsRouter.route('/apply').post((req, res) => new participant_controller_1.ParticipantController().apply(req, res));
participantsRouter.route('/workshopRequest').post((req, res) => new participant_controller_1.ParticipantController().workshopRequest(req, res));
participantsRouter.route('/myLikes').get((req, res) => new participant_controller_1.ParticipantController().getMyLikes(req, res));
exports.default = participantsRouter;
//# sourceMappingURL=participants.routes.js.map