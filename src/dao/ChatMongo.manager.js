import chatmodel from './models/chatmodel.js';

class ChatMongoManager {
    constructor() {
        this.chatmodel = chatmodel;
    }

    getMessages = async () => {
        try {
            return await this.chatmodel.find();
        } catch (error) {
            throw error;
        }
    }

    addMessage = async (user, message) => {
        const newMessage = {
            user: user,
            message: message
        };
        try {
            console.log(newMessage);
            return await this.chatmodel.create(newMessage);
        } catch (error) {
            throw error;
        }
    }
}

export default ChatMongoManager;
