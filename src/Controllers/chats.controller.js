import { chatService } from "../service/service.js";


class ChatController {
    constructor() {
        this.chatService = chatService
    }
    getMessage = async (req, res) => {
        try {
            const messages = await chatService.getMessages();
            res.status(200).send({ status: 'success', payload: messages });
    
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            const newMessage = await chatService.addMessage(user, message);
            res.send({ status: 'success', payload: newMessage });
    
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }
}

export default ChatController