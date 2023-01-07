"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantController = void 0;
const user_1 = __importDefault(require("../models/user"));
const workshop_1 = __importDefault(require("../models/workshop"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
class ParticipantController {
    constructor() {
        this.myPastWorkshops = (req, res) => {
            let user_id = req.body.user_id;
            user_1.default.findById(user_id, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    res.status(500).send({ message: "User not found!" });
                    return;
                }
                let array = user.pastWorkshops;
                let workshops = [];
                for (let i = 0; i < array.length; i++) {
                    let workshop = yield workshop_1.default.findById(array[i]);
                    workshops.push(workshop.toJSON());
                }
                /*array.forEach(id=> async function() {
                    let workshop = await WorkshopModel.findById(id)
                    workshops.push(workshop.toJSON())
                })*/
                console.log(workshops);
                res.status(200).send(workshops);
            }));
        };
    }
}
exports.ParticipantController = ParticipantController;
//# sourceMappingURL=participant.controller.js.map