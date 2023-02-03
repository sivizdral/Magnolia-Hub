import express from 'express'
import { ActionController } from '../controllers/action.controller';

const actionsRouter = express.Router();

actionsRouter.route('/allWorkshopLikes').get(
    (req, res)=>new ActionController().allWorkshopLikes(req, res)
)

export default actionsRouter