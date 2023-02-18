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
const user_1 = __importDefault(require("../models/user"));
const workshop_1 = __importDefault(require("../models/workshop"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path = require('path');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const user_controller_1 = require("./user.controller");
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
            /*const [dateStr, timeStr] = date.split(' ')
            const [month, day, year] = dateStr.split('-')
            const [hours, minutes, seconds] = timeStr.split(':')
            const dat = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)*/
            const workshop = new workshop_1.default({
                name: name,
                date: date,
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
                        status: jsonWorkshop.status,
                        short_description: jsonWorkshop.short_description,
                    });
                });
                res.status(200).send(jsonArr);
            });
        };
        this.addGallery = (req, res) => {
            let gallery = req.files;
            let workshop_id = req.body.workshop_id;
            console.log(gallery);
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
            let organizer_id = req.query.id;
            workshop_1.default.find({ 'organizer': new mongoose_1.default.Types.ObjectId(organizer_id) }, (err, workshops) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let jsonArr = [];
                workshops.forEach(workshop => {
                    jsonArr.push({
                        workshop_id: workshop._id,
                        name: workshop.name,
                        date: workshop.date,
                        location: workshop.location,
                        photo: workshop.photo,
                        short_description: workshop.short_description,
                    });
                });
                res.status(200).send(jsonArr);
            });
        };
        this.acceptApplication = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let user_id = req.body.user_id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    return res.status(404).send({ message: "Workshop Not found." });
                }
                if (!workshop.pendingList.includes(new mongoose_1.default.Types.ObjectId(user_id))) {
                    return res.status(404).send({ message: "User not found in pending list." });
                }
                workshop.pendingList.splice(workshop.pendingList.indexOf(new mongoose_1.default.Types.ObjectId(user_id)), 1);
                workshop.participantsList.push(new mongoose_1.default.Types.ObjectId(user_id));
                workshop.save((err, wsp) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    return res.status(200).send({ message: "Applicant accepted!" });
                });
            });
        };
        this.rejectApplication = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let user_id = req.body.user_id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    return res.status(404).send({ message: "Workshop Not found." });
                }
                if (!workshop.pendingList.includes(new mongoose_1.default.Types.ObjectId(user_id))) {
                    return res.status(404).send({ message: "User not found in pending list." });
                }
                workshop.pendingList.splice(workshop.pendingList.indexOf(new mongoose_1.default.Types.ObjectId(user_id)), 1);
                workshop.save((err, wsp) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    let waitlist = workshop.waitingList;
                    if (waitlist.length == 0)
                        return;
                    const text = "A place has opened up on the " + workshop.name + " workshop. This is your notification to take quick action and sign up before another participant takes the available place! Be quick!";
                    for (let i = 0; i < waitlist.length; i++) {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        user_1.default.findById(waitlist[i], (err, user) => {
                            try {
                                new user_controller_1.UserController().sendEmail(user.email, "Workshop opening", text);
                            }
                            catch (err) {
                                console.log(err);
                                res.send("an error occured");
                            }
                        });
                    }
                    user_1.default.findById(user_id, (err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        if (!user.pendingWorkshops.includes(new mongoose_1.default.Types.ObjectId(user_id))) {
                            return res.status(404).send({ message: "Workshop not found in pending list." });
                        }
                        user.pendingWorkshops.splice(user.pendingWorkshops.indexOf(new mongoose_1.default.Types.ObjectId(user_id)), 1);
                        user.save((err, user) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            return res.status(200).send({ message: "Applicant rejected!" });
                        });
                    });
                });
            });
        };
        this.pendingApplicants = (req, res) => {
            let workshop_id = req.query.workshop_id;
            workshop_1.default.findById(workshop_id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let ids = [];
                for (let i = 0; i < workshop.pendingList.length; i++) {
                    ids.push(workshop.pendingList[i]);
                }
                user_1.default.find({ _id: { $in: ids } }, (err, data) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    let names = [];
                    data.forEach(user => {
                        names.push(user.username);
                    });
                    res.status(200).send({ 'names': names, 'ids': ids });
                });
            });
        };
        this.update = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let name = req.body.name;
            let date = req.body.date;
            let location = req.body.location;
            let short_description = req.body.short_description;
            let long_description = req.body.long_description;
            let photo = req.files;
            let capacity = req.body.capacity;
            let photoChange = req.body.photoChange;
            let changedFields = {
                name: name,
                date: date,
                location: location,
                short_description: short_description,
                long_description: long_description,
                capacity: capacity
            };
            workshop_1.default.findByIdAndUpdate(workshop_id, changedFields, { new: true }, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    return res.status(404).send({ message: "Workshop Not found." });
                }
                if (photoChange == "true") {
                    workshop.photo = req.files;
                    workshop.save((err, wsp) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.status(200).send({ message: "Workshop data successfully updated!" });
                        return;
                    });
                }
                else {
                    res.status(200).send({ message: "Workshop data successfully updated!" });
                    return;
                }
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
        this.cancelWorkshop = (req, res) => {
            let id = req.body.workshop_id;
            workshop_1.default.findById(id, (err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!workshop) {
                    res.status(500).send({ message: "Workshop not found!" });
                    return;
                }
                let currentTime = Date.now();
                let workshopTime = workshop.date.getTime();
                let diff = workshopTime - currentTime;
                if (diff < 0) {
                    res.status(500).send({ message: "Too late to cancel!" });
                    return;
                }
                let waitlist = workshop.waitingList.concat(workshop.participantsList).concat(workshop.pendingList);
                const text = "Unfortunately, the workshop " + workshop.name + " has been canceled! Feel free to go to our website and explore the abundance of other workshops and choose some that you like!";
                for (let i = 0; i < waitlist.length; i++) {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user_1.default.findById(waitlist[i], (err, user) => {
                        let index = user.pastWorkshops.indexOf(new mongoose_1.default.Types.ObjectId(id));
                        if (index != -1)
                            user.pastWorkshops.splice(index, 1);
                        index = user.pendingWorkshops.indexOf(new mongoose_1.default.Types.ObjectId(id));
                        if (index != -1)
                            user.pendingWorkshops.splice(index, 1);
                        try {
                            new user_controller_1.UserController().sendEmail(user.email, "Workshop cancellation", text);
                        }
                        catch (err) {
                            console.log(err);
                            res.send("an error occured");
                        }
                        user.save((err, user) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                        });
                    });
                }
                workshop.status = "cancelled";
                workshop.waitingList = [];
                workshop.pendingList = [];
                workshop.participantsList = [];
                workshop.save((err, workshop) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                });
            });
        };
        this.saveAsJson = (req, res) => {
            let workshop_id = req.body.workshop_id;
            let organizer_id = req.body.organizer_id;
            if (!fs_1.default.existsSync("json_workshops/" + organizer_id)) {
                fs_1.default.mkdir("json_workshops/" + organizer_id, { recursive: true }, (err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    workshop_1.default.findById(workshop_id, (err, workshop) => {
                        fs_1.default.writeFile("json_workshops/" + organizer_id + "/" + workshop_id + ".json", JSON.stringify(workshop, null, 2), (err) => {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                console.log(`File created successfully.`);
                            }
                        });
                        return res.status(200).send("Model saved to file successfully.");
                    });
                });
            }
            else {
                workshop_1.default.findById(workshop_id, (err, workshop) => {
                    fs_1.default.writeFile("json_workshops/" + organizer_id + "/" + workshop_id + ".json", JSON.stringify(workshop, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            console.log(`File created successfully.`);
                        }
                    });
                    return res.status(200).send("Model saved to file successfully.");
                });
            }
        };
        this.loadJSON = (req, res) => {
            let workshop_id = req.query.id;
            let organizer_id = req.query.organizer_id;
            const filePath = "json_workshops/" + organizer_id + "/" + workshop_id + ".json";
            fs_1.default.readFile(filePath, "utf-8", (err, data) => {
                if (err) {
                    console.error(err);
                }
                else {
                    const model = JSON.parse(data);
                    console.log(`File loaded successfully.`);
                    res.status(200).send(model);
                }
            });
        };
        this.allJSON = (req, res) => {
            let organizer_id = req.query.id;
            fs_1.default.readdir("json_workshops/" + organizer_id, (err, files) => {
                if (err) {
                    console.error(err);
                }
                else {
                    let ids = [];
                    for (let i = 0; i < files.length; i++) {
                        const id = files[i].split('.')[0];
                        ids.push(id);
                    }
                    workshop_1.default.find({ _id: { $in: ids } }, (err, data) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        let names = [];
                        data.forEach(workshop => {
                            names.push(workshop.name);
                        });
                        res.status(200).send({ 'names': names, 'ids': ids });
                    });
                }
            });
        };
        this.participatedBefore = (req, res) => {
            let name = req.query.name;
            let id = req.query.id;
            let sent = false;
            workshop_1.default.find({ 'name': name }, (err, data) => {
                data.forEach(workshop => {
                    if (workshop.participantsList.includes(new mongoose_1.default.Types.ObjectId(id)) && !sent) {
                        res.status(200).send({ message: 'true' });
                        sent = true;
                        return;
                    }
                });
                if (!sent)
                    res.status(200).send({ message: 'false' });
            });
        };
        this.pastUserWorkshops = (req, res) => {
            let user_id = req.query.id;
            workshop_1.default.find({
                date: { $lt: new Date() },
                participantsList: { $in: [user_id] }
            }, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                let workshops = [];
                data.forEach(workshop => {
                    workshops.push(workshop.toJSON());
                });
                res.status(200).send(workshops);
            });
        };
    }
}
exports.WorkshopController = WorkshopController;
//# sourceMappingURL=workshop.controller.js.map