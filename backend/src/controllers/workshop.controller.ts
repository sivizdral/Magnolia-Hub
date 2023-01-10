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

        const [dateStr, timeStr] = date.split(' ')
        const [month, day, year] = dateStr.split('-')
        const [hours, minutes, seconds] = timeStr.split(':')
        const dat = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)

        const workshop = new WorkshopModel({
            name: name,
            date: dat,
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
        WorkshopModel.find((err, data)=> {
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

    getImage = (req: any, res: express.Response)=>{
        let serverPath = req.query.path;
        var filePath = path.join(__dirname, "\\..\\..\\" + serverPath).split("%20").join(" ");
        
        fs.exists(filePath, function(exists) {
            if (!exists) {
                res.status(404).send({message: "Image not found!"});
                return;
            }
        })

        var ext = path.extname(serverPath)

        var contentType = "text/plain"
        if (ext === ".png") contentType = "image/png"

        res.writeHead(200, {"Content-Type":contentType})
        fs.readFile(filePath, function(err, content) { res.end(content) })
    }

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
        let workshop_id = req.body.workshop_id

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!workshop) {
                res.status(404).send({ message: "Workshop not found!" });
                return;
            }

            res.status(200).send(workshop);
        })
    }

    getOrganizerWorkshops = (req: any, res: express.Response)=>{
        let organizer_id = req.body.user_id;

        WorkshopModel.find({organizer: new mongoose.Types.ObjectId(organizer_id)}, (err, workshops)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            workshops.forEach(workshop => {
                jsonArr.push(
                    workshop.toJSON()
                )
            });

            res.status(200).send(jsonArr);
        })
    }

    update = (req: any, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let changedFields = req.body.changedFields;

        WorkshopModel.findByIdAndUpdate(workshop_id, changedFields, {new: true}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.status(200).send(user);
        });
    }

    getTop = async (req: any, res: express.Response)=>{
        const sortBy = "likes";
        let workshops = await WorkshopModel.aggregate().addFields({"length":{"$size":`$${sortBy}`}}).sort({"length": -1}).limit(5);
        res.status(200).send(workshops);
    }

    getAvailablePlaces = (req: any, res: express.Response)=>{
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

            let avail = workshop.capacity - workshop.pendingList.length

            res.status(200).send({availablePlaces: avail})
        })
    }
}