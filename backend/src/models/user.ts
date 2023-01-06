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
        type: String
    },
    email: {
        type: String
    },
    status: {
        type: String
    },
    phone: {
        type: String
    },
    orgData: {
        organizationName: {
            type: String
        },
        organizationAddress: {
            type: String
        },
        taxNumber: {
            type: String
        },
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    },
    pastWorkshops: {
        type: Array
    },
    pendingWorkshops: {
        type: Array
    }
})

export default mongoose.model('UserModel', User, 'Users')