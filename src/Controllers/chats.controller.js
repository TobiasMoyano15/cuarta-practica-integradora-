import { chatService } from "../Service/service.js";

class ChatController {
    constructor() {
        this.chatService = chatService;
    }

    createMessage = async (req, res) => {
        try {
            const { user, message } = req.body;

            // if (message === undefined || message === null) {
            //     return res.status(400).send({ status: 'error', error: 'Error al enviar el mensaje' });
            // }

            const newMessage = await chatService.createMessage(user, message);
            res.send({ status: 'success', payload: newMessage });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getMessages = async (req, res) => {
        try {
            const messages = await chatService.getMessages();
            res.status(200).send({ status: 'success', payload: messages });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getMessageBy = async (req, res) => {
        try {
            const { pid: id } = req.params;
            const messageFound = await chatService.getMessage({ _id: id });
            res.status(200).send({ status: 'success', payload: messages });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateMessage = async (req, res) => {
        const { id } = req.params;
        const { message } = req.body;
        const messageFound = await chatService.getMessage({ _id: id });
        try {
            if (!message) {
                return res.status(400).send({ status: 'error', error: 'Sin cambios' });
            }
            if (!messageFound) return res.status(400).send({ status: 'error', error: `No existe el mensaje con el id ${pid}` });

            const updatedMessage = await chatService.updateMessage(id, { message });
            res.status(201).send({ status: 'success', payload: updatedMessage });

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    removeMessage = async (req, res) => {
        const { pid: id } = req.params;
        const messageFound = await chatService.getMessage({ _id: id });
        try {
            if (!messageFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún mensaje con el id ${id}` });

            res.status(200).send({ status: 'success', payload: messageFound });
            chatService.deleteMessage(id);

        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
}

export default ChatController;