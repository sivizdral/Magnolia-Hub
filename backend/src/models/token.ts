import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Token = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800,
    },
})

export default mongoose.model('TokenModel', Token, 'Tokens')