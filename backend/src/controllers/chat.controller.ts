import express from 'express'
import { Config } from "../config/auth.config"
import workshop from '../models/workshop';
import WorkshopModel from '../models/workshop'
import UserModel from '../models/user'
import ChatModel from '../models/chat'
import mongoose, { mongo } from 'mongoose';
import { time } from 'console';

export class ChatController {

    getUserChat = (req: express.Request, res: express.Response)=>{
        let user_id = req.query.user_id.toString();
        let workshop_id = req.query.workshop_id.toString();
        let organizer_id = req.query.organizer_id.toString();

        ChatModel.find({'participant': user_id, 'workshop': workshop_id}, (err, chat)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (chat.length == 0) {
                console.log("HERE2")
                const newChat = new ChatModel({
                    participant: new mongoose.Types.ObjectId(user_id),
                    organizer: new mongoose.Types.ObjectId(organizer_id),
                    workshop: new mongoose.Types.ObjectId(workshop_id),
                    messages: []
                })

                console.log(newChat)
        
                newChat.save((err, chat) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
        
                    res.send([chat]);
                })
            }
            else res.send(chat)
        })
    }

    sendMessage = (req: express.Request, res: express.Response)=>{
        let user_id = req.body.user_id;
        let workshop_id = req.body.workshop_id;
        let text = req.body.text;
        let sender = req.body.sender;
        let timestamp = Date.now();

        ChatModel.find({'participant': user_id, 'workshop': workshop_id}, (err, chat)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (chat.length == 0) {
                res.status(500).send({ message: "Chat not found!" });
                return;
            }
            
            let message = {
                text: text,
                sender: sender,
                timestamp: timestamp
            }

            chat = chat[0]

            chat.messages.push(message);

            chat.save((err, chat)=> {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                return res.send({message: "Message sent!"});
            })
        })
    }

    organizerSendMessage = (req: express.Request, res: express.Response)=>{
        let organizer_id = req.body.organizer_id;
        let user_id = req.body.user_id;
        let workshop_id = req.body.workshop_id;
        let text = req.body.text;
        let sender = "organizer";
        let timestamp = Date.now();

        ChatModel.find({'organizer': organizer_id, 'participant': user_id, 'workshop': workshop_id}, (err, chat)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (chat.length == 0) {
                res.status(500).send({ message: "Chat not found!" });
                return;
            }
            
            let message = {
                text: text,
                sender: sender,
                timestamp: timestamp
            }

            chat = chat[0]

            chat.messages.push(message);

            chat.save((err, chat)=> {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                return res.send({message: "Message sent!"});
            })
        })
    }

    getWorkshopOrganizerChats = (req: express.Request, res: express.Response)=>{
        let workshop_id = req.query.workshop_id.toString();
        let organizer_id = req.query.organizer_id.toString();

        ChatModel.find({'organizer': organizer_id, 'workshop': workshop_id}, (err, chats)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            chats.forEach(chat => {
                jsonArr.push(
                    chat.toJSON()
                )
            });

            res.status(200).send(jsonArr)
        })
    }
    

    allUserChats = (req: express.Request, res: express.Response)=>{
        let user_id = req.query.user_id.toString();

        ChatModel.find({'participant': user_id}, (err, chats)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let jsonArr = []
            chats.forEach(chat => {
                jsonArr.push(
                    chat.toJSON()
                )
            });

            res.status(200).send(jsonArr)
        })
    }

}