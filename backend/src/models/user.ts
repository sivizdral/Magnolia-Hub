import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: Number
    },
    email: {
        type: String
    }
})

export default mongoose.model('UserModel', User, 'Users')