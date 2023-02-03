import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.routes';
import adminRouter from './routers/admin.routes';
import workshopRouter from './routers/workshop.routes';
import participantsRouter from './routers/participants.routes';
import actionsRouter from './routers/actions.routes'
import chatsRouter from './routers/chars.routes';

const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('src/uploads'))


mongoose.connect('mongodb://127.0.0.1:27017/ArtWorkshops')
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('db connected')
})

const router = express.Router();
router.use('/users', userRouter);
router.use('/admin', adminRouter);
router.use('/workshops', workshopRouter);
router.use('/actions', actionsRouter);
router.use('/participants', participantsRouter);
router.use('/chats', chatsRouter);

app.use('/', router)
app.listen(4000, () => console.log(`Express server running on port 4000`));