import express from 'express'
import UserModel from '../models/user'

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { Config } from "../config/auth.config"

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;

        UserModel.findOne({'username': username, 'password': password}, (err, user)=>{
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
}