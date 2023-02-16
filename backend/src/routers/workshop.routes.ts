import express from 'express'
import { WorkshopController } from '../controllers/workshop.controller';
import {RegisterVerification} from '../middleware/signUpVerification'

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, './uploads/') },
    filename: function(req, file, cb) { cb(null, Date.now() + file.originalname) }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") { cb(null, true) }
    else { cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false) }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

const workshopRouter = express.Router();

workshopRouter.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

workshopRouter.route('/create').post(
    upload.array('photo', 1),
    (req, res)=>new WorkshopController().create(req, res)
)

workshopRouter.route('/addGallery').post(
    upload.array('gallery', 5),
    (req, res)=>new WorkshopController().addGallery(req, res)
)

workshopRouter.route('/all').get(
    (req, res)=>new WorkshopController().getAll(req, res)
)

workshopRouter.route('/unapproved').get(
    (req, res)=>new WorkshopController().getUnapproved(req, res)
)

workshopRouter.route('/details').get(
    (req, res)=>new WorkshopController().getDetails(req, res)
)

workshopRouter.route('/organizerWorkshops').get(
    (req, res)=>new WorkshopController().getOrganizerWorkshops(req, res)
)

workshopRouter.route('/delete').post(
    (req, res)=>new WorkshopController().delete(req, res)
)

workshopRouter.route('/update').post(
    upload.array('photo', 1),
    (req, res)=>new WorkshopController().update(req, res)
)

workshopRouter.route('/image').get(
    (req, res)=>new WorkshopController().getImage(req, res)
)

workshopRouter.route('/top').get(
    (req, res)=>new WorkshopController().getTop(req, res)
)

workshopRouter.route('/availablePlaces').get(
    (req, res)=>new WorkshopController().getAvailablePlaces(req, res)
)

workshopRouter.route('/cancelWorkshop').post(
    (req, res)=>new WorkshopController().cancelWorkshop(req, res)
)

workshopRouter.route('/saveJSON').post(
    (req, res)=>new WorkshopController().saveAsJson(req, res)
)

workshopRouter.route('/loadJSON').get(
    (req, res)=>new WorkshopController().loadJSON(req, res)
)

workshopRouter.route('/allJSON').get(
    (req, res)=>new WorkshopController().allJSON(req, res)
)

workshopRouter.route('/participatedBefore').get(
    (req, res)=>new WorkshopController().participatedBefore(req, res)
)

workshopRouter.route('/pastUserWorkshops').get(
    (req, res)=>new WorkshopController().pastUserWorkshops(req, res)
)

workshopRouter.route('/acceptApplication').post(
    (req, res)=>new WorkshopController().acceptApplication(req, res)
)

workshopRouter.route('/rejectApplication').post(
    (req, res)=>new WorkshopController().rejectApplication(req, res)
)

workshopRouter.route('/pendingApplicants').get(
    (req, res)=>new WorkshopController().pendingApplicants(req, res)
)


export default workshopRouter