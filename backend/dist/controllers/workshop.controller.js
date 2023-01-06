"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const mongoose_1 = __importDefault(require("mongoose"));
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
class WorkshopController {
    constructor() {
        this.deleteWorkshop = (req, res) => {
            let workshop_id = req.body.workshop_id;
        };
        this.create = (req, res) => {
            let name = req.body.name;
            let date = req.body.date;
            let location = req.body.location;
            let organizer = req.body.organizer;
            let short_description = req.body.short_description;
            let long_description = req.body.long_description;
            let photo = req.files;
            const [dateStr, timeStr] = date.split(' ');
            const [month, day, year] = dateStr.split('-');
            const [hours, minutes, seconds] = timeStr.split(':');
            const dat = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
            const workshop = new workshop_1.default({
                name: name,
                date: dat,
                location: location,
                organizer: new mongoose_1.default.Types.ObjectId(organizer),
                short_description: short_description,
                long_description: long_description,
                status: "unapproved",
                photo: photo,
                gallery: [],
                participantsList: [],
                pendingList: [],
                waitingList: [],
                comments: []
            });
            workshop.save((err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "Workshop was added successfully!", workshop_id: workshop._id });
            });
        };
        this.getAll = (req, res) => {
            workshop_1.default.find((err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                data.forEach(workshop => {
                    let jsonWorkshop = workshop.toJSON();
                    jsonArr.push({
                        name: jsonWorkshop.name,
                        date: jsonWorkshop.date,
                        location: jsonWorkshop.location,
                        //photo : photo
                        short_description: jsonWorkshop.short_description,
                    });
                });
                res.status(200).send(jsonArr);
            });
        };
        this.addGallery = (req, res) => {
            let gallery = req.files;
            let workshop_id = req.body.workshop_id;
            const change = {
                gallery: gallery
            };
            workshop_1.default.findByIdAndUpdate(workshop_id, change, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ message: "Gallery was added successfully!" });
            });
        };
    }
}
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map