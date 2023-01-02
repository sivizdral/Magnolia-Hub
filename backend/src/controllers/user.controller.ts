import express from 'express'
import crypto from 'crypto'
import UserModel from '../models/user'
import TokenModel from '../models/token'
import nodemailer from 'nodemailer'

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;

        UserModel.findOne({'username': username}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
            }

            var token = jwt.sign({ id: user.id }, new Config().secret, {
                expiresIn: 86400 
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
                accessToken: token
              });
        })
    }

    register = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = bcrypt.hashSync(req.body.password, 8);
        let email = req.body.email;
        let type = req.body.type;

        const user = new UserModel({
            username: username,
            password: password,
            email: email,
            type: type,
            firstname: "Pera",
            lastname: "Peric"
        })

        user.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "User was registered successfully!" });
        })
    }

    passwordReset = (req: express.Request, res: express.Response) => {
        let email = req.body.email;

        UserModel.findOne({'email': email}, async (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User with given e-mail does not exist." });
            }

            TokenModel.findOne({ 'userId': user._id }, (err, token)=>{
                if (!token) {
                    token = new TokenModel({
                        userId: user._id,
                        token: crypto.randomBytes(32).toString("hex"),
                    }).save();
                }

                const link = `localhost:4000/users/password-reset/${user._id}/${token.token}`;
                try {
                    this.sendEmail(user.email, "Password reset", link);
                    res.send("password reset link sent to your email account");
                }
                catch(err) {
                    console.log(err);
                    res.send("an error occured");
                }
                
            });
        })
    }

    sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'magnolia.hub.001@gmail.com',
                pass: 'fydsynggvtwaelrp',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: 'magnolia.hub.001@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
    }

    changePassword = (req: express.Request, res: express.Response) => {
        let password = req.body.password;


    }
}