import express from 'express'
import { UserController } from '../controllers/user.controller';
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

const userRouter = express.Router();

userRouter.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

userRouter.route('/login').post(
    (req, res)=>new UserController().login(req, res)
)

userRouter.route('/signup').post(upload.array('photo', 1), [new RegisterVerification().checkCorrectUsernameMail], (req, res)=>new UserController().register(req, res))

userRouter.route('/password-reset').post((req,res)=>new UserController().passwordReset(req,res))

userRouter.route('/password-reset/:userId/:token').post((req,res)=>new UserController().changePassword(req, res))

userRouter.route('/password-change').post((req, res)=>new UserController().normalChange(req,res))

userRouter.route('/myData').get((req, res)=>new UserController().getMyData(req,res))

userRouter.route('/updateMyData').post((req, res)=>new UserController().updateMyData(req,res))

export default userRouter