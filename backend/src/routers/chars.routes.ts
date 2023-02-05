import express from 'express'
import { ChatController } from '../controllers/chat.controller';

const chatsRouter = express.Router();

chatsRouter.route('/userChat').get(
    (req, res)=>new ChatController().getUserChat(req, res)
)

chatsRouter.route('/organizerWorkshopChats').get(
    (req, res)=>new ChatController().getWorkshopOrganizerChats(req, res)
)

chatsRouter.route('/sendMessage').post(
    (req, res)=>new ChatController().sendMessage(req, res)
)

chatsRouter.route('/organizerSendMessage').post(
    (req, res)=>new ChatController().organizerSendMessage(req, res)
)

export default chatsRouter