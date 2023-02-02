"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    },
    photo: {
        type: Object
    }
});
exports.default = mongoose_1.default.model('UserModel', User, 'Users');
//# sourceMappingURL=user.js.map