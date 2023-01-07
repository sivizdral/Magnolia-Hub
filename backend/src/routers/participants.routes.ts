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


export default participantsRouter