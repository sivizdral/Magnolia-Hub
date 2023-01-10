import express from 'express'
import { ParticipantController } from '../controllers/participant.controller';
import {RegisterVerification} from '../middleware/signUpVerification'

const participantsRouter = express.Router();

participantsRouter.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

participantsRouter.route('/myPastWorkshops').get(
    (req, res)=>new ParticipantController().myPastWorkshops(req, res)
)

participantsRouter.route('/appliedWorkshops').get(
    (req, res)=>new ParticipantController().appliedWorkshops(req, res)
)

participantsRouter.route('/cancelApplication').post(
    (req, res)=>new ParticipantController().cancelApplication(req, res)
)

participantsRouter.route('/apply').post(
    (req, res)=>new ParticipantController().apply(req, res)
)

participantsRouter.route('/workshopRequest').post(
    (req, res)=>new ParticipantController().workshopRequest(req, res)
)

participantsRouter.route('/myLikes').get(
    (req, res)=>new ParticipantController().getMyLikes(req, res)
)


export default participantsRouter