import { Router } from 'express';
import ChatController from '../Controllers/chats.controller.js';

const router = Router();
const {
    createMessage,
    getMessages,
    getMessageBy,
    updateMessage,
    removeMessage
} = new ChatController;

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageBy);
router.get('/:id', updateMessage);
router.get('/:id', removeMessage);

export default router;