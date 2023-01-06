import express from 'express'
import { WorkshopController } from '../controllers/workshop.controller';
import {RegisterVerification} from '../middleware/signUpVerification'

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, __dirname) },
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


export default workshopRouter