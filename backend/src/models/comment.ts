import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Comment = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    workshopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Workshops"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
        required: true
    }
})

export default mongoose.model('CommentModel', Comment, 'Comments')