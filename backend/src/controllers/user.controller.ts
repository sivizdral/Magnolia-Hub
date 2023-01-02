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

        console.log("ENTERED");

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

                const link = `http://localhost:4200/password-reset/${user._id}/${token.token}`;
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

    changePassword = async (req: express.Request, res: express.Response) => {
        try {
            let password = req.body.password;

            console.log("CHANGE")
            console.log(req.params)

            const user = await UserModel.findById(req.params.userId);
            if (!user) return res.status(400).send({message:"invalid link or expired"});

            const token = await TokenModel.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) return res.status(400).send({message:"Invalid link or expired"});

            user.password = bcrypt.hashSync(password, 8);
            await user.save();
            await token.delete();

            res.send({message:"password reset sucessfully."});
        } catch (error) {
            res.send({message:"An error occured"});
            console.log(error);
        }
        
    }

    normalChange = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;

        console.log(username, oldPass, newPass);

        UserModel.findOne({'username': username}, (err, user)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            
            if (!bcrypt.compareSync(oldPass, user.password)) {
                return res.status(401).send({
                    message: "Old password is not correct!"
                  });
            }

            user.password = bcrypt.hashSync(newPass, 8);
            user.save();
            res.send({message:"Password changed successfully!"});
            
        })
    }
}