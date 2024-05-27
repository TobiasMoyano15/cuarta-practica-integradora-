import {Schema, model} from 'mongoose'

const chatsSchema = new Schema ({
    user:{
        type: String,
        required:true,
    },
    message:String
})

export const chatsModel = model('messages', chatsSchema)