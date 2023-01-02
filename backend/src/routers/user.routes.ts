import express from 'express'
import { UserController } from '../controllers/user.controller';
import {RegisterVerification} from '../middleware/signUpVerification'

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

userRouter.route('/signup').post([new RegisterVerification().checkCorrectUsernameMail], (req, res)=>new UserController().register(req, res))

userRouter.route('/password-reset').post((req,res)=>new UserController().passwordReset(req,res))

userRouter.route('/password-reset/:userId/:token').post((req,res)=>new UserController().changePassword(req, res))

userRouter.route('/password-change').post((req, res)=>new UserController().normalChange(req,res))

export default userRouter