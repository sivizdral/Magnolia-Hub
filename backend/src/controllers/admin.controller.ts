import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import WorkshopModel from '../models/workshop'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"

export class AdminController {
    getAllUsers = (req: express.Request, res: express.Response)=>{
        UserModel.find((err, users)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            users.forEach(user => jsonArr.push(user.toJSON()));

            res.status(200).send(jsonArr);
        })
    }

    changeUser = (req: express.Request, res: express.Response)=>{
        let changedFields = req.body.changedFields;
        let user_id = req.body.user_id;

        UserModel.findByIdAndUpdate(user_id, changedFields, {new: true}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.status(200).send(user);
        });
    }

    deleteUser = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;

        UserModel.findOneAndDelete({'username': username}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.status(200).send(user);
        })
    }

    addUser = (req, res: express.Response)=>{
        let username = req.body.username;
        let password = bcrypt.hashSync(req.body.password, 8);
        let email = req.body.email;
        let type = req.body.type;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let status = "approved";
        let phone = req.body.phone;
        let organizationName = req.body.organizationName;
        let organizationAddress = req.body.organizationAddress;
        let taxNumber = req.body.taxNumber;

        UserModel.findOne({'email': email}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(500).send({ message: "This email already has an account linked to it!" });
                return;
            }

            UserModel.findOne({'username': username}, (err, user)=>{
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
    
                if (user) {
                    res.status(500).send({ message: "This username is already taken!" });
                    return;
                }

                const newUser = new UserModel({
                    username: username,
                    password: password,
                    email: email,
                    type: type,
                    firstname: firstname,
                    lastname: lastname,
                    status: status,
                    phone: phone,
                    orgData: {
                        organizationName: organizationName,
                        organizationAddress: organizationAddress,
                        taxNumber: taxNumber
                    },
                    likes: [],
                    comments: [],
                    pastWorkshops: [],
                    pendingWorkshops: [],
                    photo: req.files
                })
        
                newUser.save((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
        
                    res.send({ message: "User was added successfully!" });
                })
            });
        });

        
    }

    changeRequestStatus = (req: express.Request, res: express.Response)=>{
        let status = req.body.status;   
        let username = req.body.username;

        UserModel.findOne({'username': username}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                res.status(500).send({ message: "User does not exist!" });
                return;
            }

            user.status = status;

            user.save((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
    
                res.send({ message: "User status was changed successfully!" });
            })
        
        });
    }

    canApproveWorkshop = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.query.id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let organizer_id = workshop.organizer;

            UserModel.findById(organizer_id, (err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (user.pendingWorkshops.length == 0) return res.status(200).send({message: "Yes"});
                else res.status(200).send({message: "No"});
            })
        })

    }

    approveProposal = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            workshop.status = "approved";

            workshop.save((err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                UserModel.findById(workshop.organizer, (err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.type = "organizer";

                    user.save((err, user) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        return res.status(200).send({message: "User successfully promoted!"});
                    })
                })
            })
        })

    }

    rejectProposal = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;

        WorkshopModel.findById(workshop_id, (err, workshop) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            workshop.status = "rejected";

            workshop.save((err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                return res.status(200).send({message: "Workshop proposal denied!"});
            })
        })
    }
}