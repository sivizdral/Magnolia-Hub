import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import WorkshopModel from '../models/workshop'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'
import mongoose from "mongoose";
import fs from 'fs'

const path = require('path')
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"
import { UserController } from './user.controller'
import workshop from '../models/workshop'
import { ObjectId } from 'mongodb'
import { TextDecoderStream } from 'stream/web'



export class WorkshopController{

    create = (req: any, res: express.Response)=>{
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

        const workshop = new WorkshopModel({
            name: name,
            date: date,
            location: location,
            organizer: new mongoose.Types.ObjectId(organizer),
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
        })

        workshop.save((err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "Workshop was added successfully!", workshop_id: workshop._id });
        })
    }

    getAll = (req: express.Request, res: express.Response)=>{
        let name = req.query.name;
        let place = req.query.place;

        let sort = {};
        if (req.query.sort === 'name') {
        sort['name'] = 1;
        } else if (req.query.sort === 'date') {
        sort['date'] = 1;
        }

        if (!name) name = "";
        if (!place) place = "";

        WorkshopModel.find(
            {
                name: { $regex: name, $options: 'i' },
                location: { $regex: place, $options: 'i' }
            },
            null,
            { sort: sort },
            (err, data)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            data.forEach(workshop => {
                let jsonWorkshop = workshop.toJSON();
                jsonArr.push({
                    workshop_id: jsonWorkshop._id,
                    name: jsonWorkshop.name,
                    date: jsonWorkshop.date,
                    location: jsonWorkshop.location,
                    photo : jsonWorkshop.photo,
                    short_description: jsonWorkshop.short_description,
                })
            });

            res.status(200).send(jsonArr);
        })
    }

    addGallery = (req: any, res: express.Response)=>{
        let gallery = req.files;
        let workshop_id = req.body.workshop_id;

        console.log(gallery)

        const change = {
            gallery: gallery
        }

        WorkshopModel.findByIdAndUpdate(workshop_id, change, (err, data)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "Gallery was added successfully!" });
        })
    }

    delete = (req: any, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let photoPath = "";

        WorkshopModel.findByIdAndDelete(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            fs.unlink(workshop.photo[0].path, function() {})

            workshop.gallery.forEach(x=>fs.unlink(x.path, function() {}))

            res.status(200).send(workshop);
        })
    }

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

    getImage = (req: any, res: express.Response) => {
        let serverPath = req.query.path;
        var filePath = path.join(__dirname, "\\..\\..\\" + serverPath).split("%20").join(" ");
      
        fs.exists(filePath, function(exists) {
          if (!exists) {
            return res.status(404).send({message: "Image not found!"});
          }
      
          var ext = path.extname(serverPath);
          var contentType = "text/plain";
      
          if (ext === ".png") contentType = "image/png";
      
          fs.readFile(filePath, function(err, content) {
            if (err) {
              return res.status(500).send({message: "Error reading image"});
            }
      
            res.status(200).contentType(contentType).send(content);
          });
        });
      };

    getUnapproved = (req: any, res: express.Response)=>{
        WorkshopModel.find({status:"unapproved"}, (err, data)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            data.forEach(workshop => {
                jsonArr.push(
                    workshop.toJSON()
                )
            });

            res.status(200).send(jsonArr);
        })
    }

    getDetails = (req: any, res: express.Response)=>{
        let workshop_id = req.query.id

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(404).send({ message: "Workshop not found!" });
                return;
            }

            res.status(200).send([workshop]);
        })
    }

    getOrganizerWorkshops = (req: any, res: express.Response)=>{
        let organizer_id = req.query.id;

        WorkshopModel.find({'organizer': new mongoose.Types.ObjectId(organizer_id)}, (err, workshops)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            workshops.forEach(workshop => {
                jsonArr.push({
                    workshop_id: workshop._id,
                    name: workshop.name,
                    date: workshop.date,
                    location: workshop.location,
                    photo : workshop.photo,
                    short_description: workshop.short_description,
                })
            });

            res.status(200).send(jsonArr);
        })
    }

    acceptApplication = (req: any, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let user_id = req.body.user_id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                return res.status(404).send({ message: "Workshop Not found." });
            }

            if (!workshop.pendingList.includes(new mongoose.Types.ObjectId(user_id))) {
                return res.status(404).send({ message: "User not found in pending list." });
            }

            workshop.pendingList.splice(workshop.pendingList.indexOf(new mongoose.Types.ObjectId(user_id)), 1);
            workshop.participantsList.push(new mongoose.Types.ObjectId(user_id));

            workshop.save((err, wsp) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                return res.status(200).send({message: "Applicant accepted!"})
            })
        })
    }

    rejectApplication = (req: any, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let user_id = req.body.user_id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                return res.status(404).send({ message: "Workshop Not found." });
            }

            if (!workshop.pendingList.includes(new mongoose.Types.ObjectId(user_id))) {
                return res.status(404).send({ message: "User not found in pending list." });
            }

            workshop.pendingList.splice(workshop.pendingList.indexOf(new mongoose.Types.ObjectId(user_id)), 1);

            workshop.save((err, wsp) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                let waitlist = workshop.waitingList;

                if (waitlist.length == 0) return;
                const text = "A place has opened up on the " + workshop.name + " workshop. This is your notification to take quick action and sign up before another participant takes the available place! Be quick!"

                for (let i = 0; i < waitlist.length; i++) {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    UserModel.findById(waitlist[i], (err, user)=>{
                        try {
                            new UserController().sendEmail(user.email, "Workshop opening", text);
                        }
                        catch(err) {
                            console.log(err);
                            res.send("an error occured");
                        }
                    })
                    
                }

                UserModel.findById(user_id, (err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    
                    if (!user.pendingWorkshops.includes(new mongoose.Types.ObjectId(user_id))) {
                        return res.status(404).send({ message: "Workshop not found in pending list." });
                    }

                    user.pendingWorkshops.splice(user.pendingWorkshops.indexOf(new mongoose.Types.ObjectId(user_id)), 1);

                    user.save((err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        return res.status(200).send({message: "Applicant rejected!"})
                    })
                })
            })
        })
    }

    pendingApplicants = (req: any, res: express.Response)=>{
        let workshop_id = req.query.workshop_id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let ids = []

            for (let i = 0; i < workshop.pendingList.length; i++) {
                ids.push(workshop.pendingList[i])
            }

            UserModel.find({ _id: { $in: ids } }, (err, data) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                let names = []

                data.forEach(user => {
                    names.push(user.username)
                })

                res.status(200).send({'names': names, 'ids': ids})
            })
        })
    }

    update = (req: any, res: express.Response)=>{
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
        }

        WorkshopModel.findByIdAndUpdate(workshop_id, changedFields, {new: true}, (err, workshop)=>{
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

                    res.status(200).send({message:"Workshop data successfully updated!"});
                    return;
                })
            } else {
                res.status(200).send({message:"Workshop data successfully updated!"});
                return;
            }
        });
    }

    getTop = async (req: any, res: express.Response)=>{
        const sortBy = "likes";
        let workshops = await WorkshopModel.aggregate().addFields({"length":{"$size":`$${sortBy}`}}).sort({"length": -1}).limit(5);
        res.status(200).send(workshops);
    }

    getAvailablePlaces = (req: any, res: express.Response)=>{
        let workshop_id = req.query.id;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(500).send({ message: "Workshop not found!" });
                return;
            }

            let avail = workshop.capacity - workshop.pendingList.length

            res.status(200).send({availablePlaces: avail})
        })
    }

    cancelWorkshop = (req: any, res: express.Response)=>{
        let id = req.body.workshop_id;

        WorkshopModel.findById(id, (err, workshop)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(500).send({ message: "Workshop not found!" });
                return;
            }

            let currentTime = Date.now()
            let workshopTime = workshop.date.getTime();

            let diff = workshopTime - currentTime

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

                UserModel.findById(waitlist[i], (err, user)=>{
                    let index = user.pastWorkshops.indexOf(new mongoose.Types.ObjectId(id))
                    if (index != -1) user.pastWorkshops.splice(index, 1);
                    index = user.pendingWorkshops.indexOf(new mongoose.Types.ObjectId(id))
                    if (index != -1) user.pendingWorkshops.splice(index, 1);

                    try {
                        new UserController().sendEmail(user.email, "Workshop cancellation", text);
                    }
                    catch(err) {
                        console.log(err);
                        res.send("an error occured");
                    }

                    user.save((err, user)=>{
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                    })
                })
                
            }

            workshop.status = "cancelled";
            workshop.waitingList = []
            workshop.pendingList = []
            workshop.participantsList = []
            workshop.save((err, workshop)=>{
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            })
        })

    }

    saveAsJson = (req: any, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let organizer_id = req.body.organizer_id;

        if (!fs.existsSync("json_workshops/" + organizer_id)) {
            fs.mkdir("json_workshops/" + organizer_id, { recursive: true }, (err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                WorkshopModel.findById(workshop_id, (err, workshop) => {
                    fs.writeFile("json_workshops/" + organizer_id + "/" + workshop_id + ".json", JSON.stringify(workshop, null, 2), (err) => {
                        if (err) {
                          console.error(err);
                        } else {
                          console.log(`File created successfully.`);
                        }
                      });
        
                    return res.status(200).send("Model saved to file successfully.");
                })
            })
        } else {
            WorkshopModel.findById(workshop_id, (err, workshop) => {
                fs.writeFile("json_workshops/" + organizer_id + "/" + workshop_id + ".json", JSON.stringify(workshop, null, 2), (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(`File created successfully.`);
                    }
                  });
    
                return res.status(200).send("Model saved to file successfully.");
            })
        }

        
    }

    loadJSON = (req: any, res: express.Response)=>{
        let workshop_id = req.query.id;
        let organizer_id = req.query.organizer_id;

        const filePath = "json_workshops/" + organizer_id + "/" + workshop_id + ".json"

        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
              console.error(err);
            } else {
              const model = JSON.parse(data);
              console.log(`File loaded successfully.`);
              res.status(200).send(model);
            }
          });
    }

    allJSON = (req: any, res: express.Response)=>{
        let organizer_id = req.query.id;
        fs.readdir("json_workshops/" + organizer_id, (err, files) => {
            if (err) {
              console.error(err);
            } else {
                let ids = []
                for (let i = 0; i < files.length; i++) {
                    const id = files[i].split('.')[0];
                    ids.push(id)
                }
                WorkshopModel.find({ _id: { $in: ids } }, (err, data) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    let names = []

                    data.forEach(workshop => {
                        names.push(workshop.name)
                    })

                    res.status(200).send({'names': names, 'ids': ids})
                })
            }
          });
    }

    participatedBefore = (req: any, res: express.Response)=>{
        let name = req.query.name;
        let id = req.query.id;
        let sent = false;

        WorkshopModel.find({'name': name}, (err, data) => {
            data.forEach(workshop => {
                if (workshop.participantsList.includes(new mongoose.Types.ObjectId(id)) && !sent) {
                    res.status(200).send({message: 'true'})
                    sent = true
                    return
                }
            })

            if (!sent) res.status(200).send({message: 'false'});
        })

    }

    pastUserWorkshops = (req: any, res: express.Response)=>{
        let user_id = req.query.id;

        WorkshopModel.find({
            date: { $lt: new Date() },
            participantsList: { $in: [user_id] }
          }, (err, data) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let workshops = []

            data.forEach(workshop => {
                workshops.push(workshop.toJSON())
            })

            res.status(200).send(workshops)
          })
    }

}