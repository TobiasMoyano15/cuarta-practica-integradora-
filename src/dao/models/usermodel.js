import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    first_name: {
        type: String
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: Number,
    password: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        emum: ['user', 'premium', 'admin'],
        default: 'user'
    }
});

userSchema.plugin(mongoosePaginate);

const UserModel = { userCollection,userSchema };
export default UserModel;