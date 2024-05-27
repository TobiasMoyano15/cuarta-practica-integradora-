import {chatsModel} from './models/chat.model.js'

class ChatMongoManager {

    constructor() {
        this.chatsModel = chatsModel
    }
    
    getMessages = async() => {
        try {
            return await chatsModel.find();
        
        } catch (error) {
            throw error
        }
    }
    
    addMessage = async(user, message) => {
        const newMessage = {
            user:user,
            message:message
        }
        try {
            console.log(newMessage)
            return  await chatsModel.create(newMessage);

            
        } catch (error) {
            throw error
        }
    }
}

export default ChatMongoManager