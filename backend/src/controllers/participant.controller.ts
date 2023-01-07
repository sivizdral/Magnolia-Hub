import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import WorkshopModel from '../models/workshop'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"
import mongoose from "mongoose"

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

            let array = user.pendingWorkshops;
            let workshops = [];

            for (let i = 0; i < array.length; i++) {
                let workshop = await WorkshopModel.findById(array[i])
                workshops.push(workshop.toJSON())
            }

            res.status(200).send(workshops)
        })
    }
}