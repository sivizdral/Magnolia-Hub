import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import WorkshopModel from '../models/workshop'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'
import { UserController } from './user.controller'

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"
import mongoose, { mongo } from "mongoose"

export class ParticipantController {

    myPastWorkshops = (req: express.Request, res: express.Response)=>{
        let user_id = req.body.user_id;

        UserModel.findById(user_id, async (err, user)=>{
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
                let workshop = await WorkshopModel.findById(array[i])
                workshops.push(workshop.toJSON())
            }

            res.status(200).send(workshops)
        })

    }

    appliedWorkshops = (req: express.Request, res: express.Response)=>{
        let user_id = req.query.id;

        UserModel.findById(user_id, async (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                res.status(500).send({ message: "User not found!" });
                return;
            }

            let array = user.pendingWorkshops;
            let workshops = [];

            

            for (let i = 0; i < array.length; i++) {
                let workshop = await WorkshopModel.findById(array[i])
                let jsonWorkshop = workshop.toJSON();
                workshops.push({
                    workshop_id: jsonWorkshop._id,
                    name: jsonWorkshop.name,
                    date: jsonWorkshop.date,
                    location: jsonWorkshop.location,
                    photo : jsonWorkshop.photo,
                    short_description: jsonWorkshop.short_description,
                })
            }

            res.status(200).send(workshops)
        })
    }

    cancelApplication = (req: express.Request, res: express.Response)=>{
        let user_id = req.body.user_id;
        let workshop_id = req.body.workshop_id;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(500).send({ message: "Workshop not found!" });
                return;
            }

            let list = workshop.pendingList;
            let list2 = workshop.participantsList;

            if (!list.includes(new mongoose.Types.ObjectId(user_id)) && !list2.includes(new mongoose.Types.ObjectId(user_id))) {
                res.status(500).send({ message: "This user has never applied for this workshop!" });
                return;
            }

            let currentTime = Date.now()
            let workshopTime = workshop.date.getTime();

            let diff = workshopTime - currentTime

            if (diff < 1000 * 60 * 60 * 12) {
                res.status(500).send({ message: "Too late to cancel!" });
                return;
            }

            list.splice(list.indexOf(new mongoose.Types.ObjectId(user_id)), 1);
            workshop.participantsList.splice(workshop.participantsList.indexOf(new mongoose.Types.ObjectId(user_id)), 1);
            workshop.pendingList = list;

            workshop.save((err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
            })

            UserModel.findById(user_id, (err, user)=>{
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.pendingWorkshops.splice(user.pendingWorkshops.indexOf(new mongoose.Types.ObjectId(workshop_id)), 1);

                user.save((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                })
            })

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
        })
    }

    apply = (req: express.Request, res: express.Response)=>{
        let user_id = req.body.user_id;
        let workshop_id = req.body.workshop_id;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(500).send({ message: "Workshop not found!" });
                return;
            }

            let participants = workshop.pendingList.concat(workshop.participantsList).concat(workshop.waitingList);
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].toHexString() === user_id) {
                    res.status(500).send({ message: "This user has already applied for this workshop!" });
                return;
                }
            }

            // if (participants.includes(new mongoose.Types.ObjectId(user_id))) {
            //     res.status(500).send({ message: "This user has already applied for this workshop!" });
            //     return;
            // }

            if (participants.length >= workshop.capacity) {
                workshop.waitingList.push(new mongoose.Types.ObjectId(user_id));
                workshop.save((err, workshop) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                })
                res.status(200).send({message: "No more places, the user has been added to the waiting list!"});
            } else {
                workshop.pendingList.push(new mongoose.Types.ObjectId(user_id));
                workshop.save((err, workshop) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                })


                UserModel.findById(user_id, (err, user)=>{
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.pendingWorkshops.push(new mongoose.Types.ObjectId(workshop_id));

                    user.save((err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                    })
                })
                res.status(200).send({message: "Successful application!"});
            }
        })
    }

    workshopRequest = (req: any, res: express.Response)=>{
        let photo = req.files;
        let name = req.body.name;
        let location = req.body.location;
        let date = req.body.date;
        let short_desc = req.body.short_description;
        let long_desc = req.body.long_description;
        let organizer = req.body.user_id;
        let capacity = req.body.capacity;

        let wshop = new WorkshopModel({
            photo: photo,
            name: name,
            location: location,
            date: date,
            short_description: short_desc,
            long_description: long_desc,
            organizer: new mongoose.Types.ObjectId(organizer),
            status: "unapproved-made-by-user",
            capacity: capacity,
            gallery: [],
            participantsList: [],
            pendingList: [],
            waitingList: [],
            likes: [],
            comments: []
        });

        wshop.save((err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.status(200).send({message: "Workshop request successfully submitted!"})
        })
    }

    getMyLikes = (req: express.Request, res: express.Response)=>{
        let username = req.query.username;

        UserModel.find({username:username}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                res.status(500).send({ message: "User not found!" });
                return;
            }

            user = user[0]

            let likes = user.likes;
            let jsonArr = []
            likes.forEach(element => {
                jsonArr.push(element.toJSON())
            });
            res.status(200).send(likes);
        })
    }

    
}