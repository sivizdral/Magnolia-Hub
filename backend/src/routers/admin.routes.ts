import express from 'express'
import { AdminController } from '../controllers/admin.controller';

const adminRouter = express.Router();

adminRouter.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

adminRouter.route('/getUsers').get(
    (req, res)=>new AdminController().getAllUsers(req, res)
)

adminRouter.route('/changeUser').post(
    (req, res)=>new AdminController().changeUser(req, res)
)

adminRouter.route('/deleteUser').post(
    (req, res)=>new AdminController().deleteUser(req, res)
)

adminRouter.route('/addUser').post(
    (req, res)=>new AdminController().addUser(req, res)
)

adminRouter.route('/changeRequestStatus').post(
    (req, res)=>new AdminController().changeRequestStatus(req, res)
)

export default adminRouter