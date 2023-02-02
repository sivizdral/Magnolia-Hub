import express from 'express'
import { AdminController } from '../controllers/admin.controller';
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
    upload.array('photo', 1),
    (req, res)=>new AdminController().addUser(req, res)
)

adminRouter.route('/changeRequestStatus').post(
    (req, res)=>new AdminController().changeRequestStatus(req, res)
)

export default adminRouter