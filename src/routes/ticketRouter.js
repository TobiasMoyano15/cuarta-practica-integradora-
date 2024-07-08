import { Router } from 'express';
import TicketController from '../../Controllers/tickets.controller.js';

const router = Router();
const {
    getTicket,
    removeTicket
} = new TicketController();

router.get('/:tid', getTicket);
router.delete('/:cid', removeTicket);

export default router;