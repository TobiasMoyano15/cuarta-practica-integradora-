import { chatService } from "../service/service.js";

class ChatController {
    constructor() {
        this.chatService = chatService;
    }

    getMessages = async (req, res) => {
        try {
            const messages = await this.chatService.getMessages();
            res.status(200).send({ status: 'success', payload: messages });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;
            const newMessage = await this.chatService.addMessage(user, message);
            res.send({ status: 'success', payload: newMessage });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getMessageBy = async (req, res) => {
        try {
            const { pid: id } = req.params;
            const messageFound = await this.chatService.getMessage({ _id: id });
            if (!messageFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún mensaje con el id ${id}` });
            res.status(200).send({ status: 'success', payload: messageFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateMessage = async (req, res) => {
        const { id } = req.params;
        const { message } = req.body;
        try {
            const messageFound = await this.chatService.getMessage({ _id: id });
            if (!message) return res.status(400).send({ status: 'error', error: 'Sin cambios' });
            if (!messageFound) return res.status(400).send({ status: 'error', error: `No existe el mensaje con el id ${id}` });

            const updatedMessage = await this.chatService.updateMessage(id, { message });
            res.status(201).send({ status: 'success', payload: updatedMessage });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    removeMessage = async (req, res) => {
        const { pid: id } = req.params;
        try {
            const messageFound = await this.chatService.getMessage({ _id: id });
            if (!messageFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún mensaje con el id ${id}` });

            await this.chatService.deleteMessage(id);
            res.status(200).send({ status: 'success', payload: `El mensaje con el id ${id} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
}

export default ChatController;
