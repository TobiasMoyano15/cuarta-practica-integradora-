import {Schema, model} from 'mongoose'

const chatsSchema = new Schema ({
    user:{
        type: String,
        required:true,
    },
    message:String
})

const chatsModel = {chatsSchema}
export default chatsModel