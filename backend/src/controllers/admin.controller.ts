import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
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

    addUser = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = bcrypt.hashSync(req.body.password, 8);
        let email = req.body.email;
        let type = req.body.type;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let phone = req.body.phone;
        let orgData = req.body.orgData;

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
                    status: "active",
                    phone: phone,
                    orgData: orgData
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
}