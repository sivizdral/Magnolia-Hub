import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import WorkshopModel from '../models/workshop'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'
import mongoose from "mongoose";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"



export class WorkshopController{
    deleteWorkshop = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id


    }

    create = (req: any, res: express.Response)=>{
        let name = req.body.name;
        let date = req.body.date;
        let location = req.body.location;
        let organizer = req.body.organizer;
        let short_description = req.body.short_description;
        let long_description = req.body.long_description;
        let photo = req.files;

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
}