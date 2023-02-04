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
exports.WorkshopController = void 0;
const workshop_1 = __importDefault(require("../models/workshop"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path = require('path');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
class WorkshopController {
    constructor() {
        this.create = (req, res) => {
            let name = req.body.name;
            let date = req.body.date;
            let location = req.body.location;
            let organizer = req.body.organizer;
            let short_description = req.body.short_description;
            let long_description = req.body.long_description;
            let photo = req.files;
            let capacity = req.body.capacity;
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
                capacity: capacity,
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
            let name = req.query.name;
            let place = req.query.place;
            let sort = {};
            if (req.query.sort === 'name') {
                sort['name'] = 1;
            }
            else if (req.query.sort === 'date') {
                sort['date'] = 1;
            }
            if (!name)
                name = "";
            if (!place)
                place = "";
            workshop_1.default.find({
                name: { $regex: name, $options: 'i' },
                location: { $regex: place, $options: 'i' }
            }, null, { sort: sort }, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                data.forEach(workshop => {
                    let jsonWorkshop = workshop.toJSON();
                    jsonArr.push({
                        workshop_id: jsonWorkshop._id,
                        name: jsonWorkshop.name,
                        date: jsonWorkshop.date,
                        location: jsonWorkshop.location,
                        photo: jsonWorkshop.photo,
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
        this.delete = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let photoPath = "";
            workshop_1.default.findByIdAndDelete(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                fs_1.default.unlink(workshop.photo[0].path, function () { });
                workshop.gallery.forEach(x => fs_1.default.unlink(x.path, function () { }));
                res.status(200).send(workshop);
            });
        };
        // getImage = (req: any, res: express.Response)=>{
        //     let serverPath = req.query.path;
        //     var filePath = path.join(__dirname, "\\..\\..\\" + serverPath).split("%20").join(" ");
        //     let ex = false;
        //     fs.exists(filePath, function(exists) {
        //         if (!exists) {
        //             res.status(404).send({message: "Image not found!"});
        //             ex = true;
        //             return;
        //         }
        //     })
        //     if (ex) return;
        //     var ext = path.extname(serverPath)
        //     var contentType = "text/plain"
        //     if (ext === ".png") contentType = "image/png"
        //     //res.writeHead(200, {"Content-Type":contentType})
        //     fs.readFile(filePath, function(err, content) { res.status(200).contentType(contentType).send(content); })
        // }
        this.getImage = (req, res) => {
            let serverPath = req.query.path;
            var filePath = path.join(__dirname, "\\..\\..\\" + serverPath).split("%20").join(" ");
            fs_1.default.exists(filePath, function (exists) {
                if (!exists) {
                    return res.status(404).send({ message: "Image not found!" });
                }
                var ext = path.extname(serverPath);
                var contentType = "text/plain";
                if (ext === ".png")
                    contentType = "image/png";
                fs_1.default.readFile(filePath, function (err, content) {
                    if (err) {
                        return res.status(500).send({ message: "Error reading image" });
                    }
                    res.status(200).contentType(contentType).send(content);
                });
            });
        };
        this.getUnapproved = (req, res) => {
            workshop_1.default.find({ status: "unapproved" }, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                data.forEach(workshop => {
                    jsonArr.push(workshop.toJSON());
                });
                res.status(200).send(jsonArr);
            });
        };
        this.getDetails = (req, res) => {
            let workshop_id = req.query.id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    res.status(404).send({ message: "Workshop not found!" });
                    return;
                }
                res.status(200).send([workshop]);
            });
        };
        this.getOrganizerWorkshops = (req, res) => {
            let organizer_id = req.body.user_id;
            workshop_1.default.find({ organizer: new mongoose_1.default.Types.ObjectId(organizer_id) }, (err, workshops) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                workshops.forEach(workshop => {
                    jsonArr.push(workshop.toJSON());
                });
                res.status(200).send(jsonArr);
            });
        };
        this.update = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let changedFields = req.body.changedFields;
            workshop_1.default.findByIdAndUpdate(workshop_id, changedFields, { new: true }, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(200).send(user);
            });
        };
        this.getTop = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const sortBy = "likes";
            let workshops = yield workshop_1.default.aggregate().addFields({ "length": { "$size": `$${sortBy}` } }).sort({ "length": -1 }).limit(5);
            res.status(200).send(workshops);
        });
        this.getAvailablePlaces = (req, res) => {
            let workshop_id = req.query.id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    res.status(500).send({ message: "Workshop not found!" });
                    return;
                }
                let avail = workshop.capacity - workshop.pendingList.length;
                res.status(200).send({ availablePlaces: avail });
            });
        };
    }
}
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map