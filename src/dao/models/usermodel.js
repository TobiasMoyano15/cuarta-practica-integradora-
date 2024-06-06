import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new Schema({
    first_name: {
        type: String,
        index: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        emum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.plugin(mongoosePaginate);

export const usermodel = model(userCollection, userSchema);