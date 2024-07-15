import chatmodel from './models/chatmodel.js';

class ChatMongoManager {
    constructor() {
        this.chatmodel = chatmodel;
    }

    getMessages = async () => {
        try {
            return await this.chatmodel.find();
        } catch (error) {
            console.error('Error fetching messages:', error);
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
            console.error('Error adding message:', error);
            throw error;
        }
    }
}

export default ChatMongoManager;
