import { Router } from 'express';
import TicketController from '../Controllers/tickets.controller.js';

const router = Router();
const {
    getTicket,
    removeTicket
} = new TicketController();

// Asumiendo que la autenticación es requerida para ambos endpoints
router.get('/:tid', passportCall('jwt'), getTicket);
router.delete('/:tid', passportCall('jwt'), removeTicket);

export default router;
