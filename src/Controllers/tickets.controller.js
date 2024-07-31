import { ticketService, cartService, userService } from "../Service/service.js";

class TicketController {
    constructor() {
        this.ticketService = ticketService;
        this.cartService = cartService;
        this.userService = userService;
    }
    
    getTicket = async (req, res) => {
        try {
            const ticket = await ticketService.getAll();
            res.send({ status: 'success', payload: ticket });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
    getTickets = async (req, res) => {
        const { email } = req.params;
        const ticketFound = await ticketService.getTickets({ purchaser: email });
        try {
            if (!ticketFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el ticket del usuario ${email}` });
            res.status(200).send({ status: 'success', payload: ticketFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    removeTicket = async (req, res) => {
        const { tid } = req.params;
        try {
            const ticketFound = await ticketService.getTicket({ _id: tid });

            if (!ticketFound) return res.status(400).send({ status: 'error', error: `¡Error! No existe el ticket` });
            res.status(200).send({ status: 'success', payload: ticketFound });
            ticketService.removeTicket(tid);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
}

export default TicketController;