import express from 'express'
import { Config } from "../config/auth.config"
import workshop from '../models/workshop';
import WorkshopModel from '../models/workshop'
import UserModel from '../models/user'
import CommentModel from '../models/comment'
import mongoose from 'mongoose';
import user from '../models/user';

export class ActionController {

    allWorkshopLikes = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.query.id.toString();

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            
            res.send({ likes: workshop.likes });
        })
    }

    like = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id.toString();
        let username = req.body.username;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            workshop.likes.push(username);

            console.log(username)

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

                    user = user[0]

                    user.likes.push(new mongoose.Types.ObjectId(workshop_id))

                    user.save((err, workshop) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.status(200).send({message: "Like successful!"});
                    })
                })
            })
        })
    }

    removeLike = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id.toString();
        let username = req.body.username;

        WorkshopModel.findById(workshop_id, (err, workshop)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let index = workshop.likes.indexOf(username);

            if (index != -1) workshop.likes.splice(index, 1);

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

                    user = user[0]

                    let index = user.likes.indexOf(new mongoose.Types.ObjectId(workshop_id));

                    if (index != -1) user.likes.splice(index, 1);

                    user.save((err, workshop) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.status(200).send({message: "Unlike successful!"});
                    })
                })
            })
        })
    }

    allWorkshopComments = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.query.id;

        CommentModel.find({'workshop':workshop_id}, (err, data)=>{
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let photos = [];
            let firstnames = [];
            let ids = []

            for (let i = 0; i < data.length; i++) {
                ids.push(data[i].user)
            }

            UserModel.find({ _id: { $in: ids } }, (err, users)=>{
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < ids.length; i++) {
                    for (let j = 0; j < users.length; j++) {
                        if (ids[i].equals(users[j]._id)) {
                            photos.push(users[j].photo[0].path);
                            firstnames.push(users[j].firstname)
                            break;
                        }
                    }
                }

                res.send({'comments': data, 'firstnames': firstnames, 'photos': photos});

            })


        })
    }

    postComment = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.body.workshop_id;
        let user_id = req.body.user_id;
        let text = req.body.text;

        let newComment = new CommentModel({
            workshop: workshop_id,
            user: user_id,
            timestamp: Date.now(),
            text: text
        })

        newComment.save((err, comment) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "Comment was added successfully!" });
        })
    }



}