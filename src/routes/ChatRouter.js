import { Router } from 'express';
import ChatMongoManager from '../dao/ChatMongo.manager.js'; // Corregido el nombre del archivo

const router = Router();
const chatService = new ChatMongoManager(); // Agregado paréntesis para la instanciación

router.get('/', async (req, res) => {
    try {
        const messages = await chatService.getMessages();
        res.status(200).send({ status: 'success', payload: messages });

    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message }); // Enviado error.message
    }
});

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = await chatService.addMessage(user, message);
        res.send({ status: 'success', payload: newMessage });

    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message }); // Enviado error.message
    }
});

export default router;
