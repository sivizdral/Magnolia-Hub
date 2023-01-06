import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Workshop = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    photo: {
        type: Object,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    long_description: {
        type: String,
        required: true
    },
    gallery: {
        type: Array
    },
    status: {
        type: String,
        required: true
    },
    participantsList: [Schema.Types.ObjectId],
    pendingList: [Schema.Types.ObjectId],
    waitingList:  [Schema.Types.ObjectId],
    likes:  [Schema.Types.ObjectId],
    comments:  [Schema.Types.ObjectId]
})

export default mongoose.model('WorkshopModel', Workshop, 'Workshops')