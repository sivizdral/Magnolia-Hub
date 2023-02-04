import express from 'express'
import { ActionController } from '../controllers/action.controller';

const actionsRouter = express.Router();

actionsRouter.route('/allWorkshopLikes').get(
    (req, res)=>new ActionController().allWorkshopLikes(req, res)
)

actionsRouter.route('/like').post(
    (req, res)=>new ActionController().like(req, res)
)

actionsRouter.route('/removeLike').post(
    (req, res)=>new ActionController().removeLike(req, res)
)

actionsRouter.route('/allWorkshopComments').get(
    (req, res)=>new ActionController().allWorkshopComments(req, res)
)

actionsRouter.route('/comment').post(
    (req, res)=>new ActionController().postComment(req, res)
)

export default actionsRouter