import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Chat = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    participant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    workshop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Workshops",
    },
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
})

export default mongoose.model('ChatModel', Chat, 'Chats')