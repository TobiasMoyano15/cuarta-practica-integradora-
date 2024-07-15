import { ticketService, cartService, userService } from "../Service/service.js";

class TicketController {
    constructor() {
        this.ticketService = ticketService;
        this.cartService = cartService;
        this.userService = userService;
    }

    createTicket = async (req, res) => {
        const { cartId, userId, totalAmount } = req.body;
        try {
            const cart = await this.cartService.getCart({ _id: cartId });
            const user = await this.userService.getUser({ _id: userId });

            if (!cart || !user) {
                return res.status(404).send({ status: 'error', error: 'Cart or User not found' });
            }

            const newTicket = {
                code: Math.random().toString(36).substr(2, 9).toUpperCase(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email
            };

            const createdTicket = await this.ticketService.createTicket(newTicket);
            res.status(201).send({ status: 'success', payload: createdTicket });
        } catch (error) {
            res.status(500).send({ status: 'error', error: `Error creating ticket: ${error.message}` });
        }
    };

    getTicket = async (req, res) => {
        const { tid } = req.params;
        try {
            const ticketFound = await ticketService.getTicket({ _id: tid });
            if (!ticketFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el ticket con el id ${tid}` });
            res.status(200).send({ status: 'success', payload: ticketFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };

    getTickets = async (req, res) => {
        const { email } = req.params;
        try {
            const ticketFound = await ticketService.getTickets({ purchaser: email });
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
            await ticketService.removeTicket(tid);
            res.status(200).send({ status: 'success', payload: `El ticket con el id ${tid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    };
}

export default TicketController;
