import express from 'express'
import { Config } from "../config/auth.config"
import workshop from '../models/workshop';
import WorkshopModel from '../models/workshop'
import UserModel from '../models/user'
import mongoose from 'mongoose';

export class ActionController {

    allWorkshopLikes = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.query.id;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ likes: workshop.likes });
        })
    }

    like = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let username = req.body.username;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            workshop.likes.push(username);

            workshop.save((err, workshop) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                UserModel.find({'username': username}, (err, user)=> {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.likes.push(new mongoose.Types.ObjectId(workshop_id))

                    user.save((err, workshop) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send("Like successful!");
                    })
                })
            })
        })
    }



}