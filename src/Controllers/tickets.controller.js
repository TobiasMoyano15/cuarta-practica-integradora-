import { ticketService, cartService, userService } from "../service/service.js";


class TicketController {
    constructor() {
        this.ticketService = ticketService;
        this.cartService = cartService;
        this.userService = userService;
    }
    

    createTicket = async (ticketData) => {
        try {
            const { cartId, userId, totalAmount } = ticketData;
            const cart = await this.cartService.getCart({ _id: cartId });
            const user = await this.userService.getUser({ _id: userId });

            if (!cart || !user) {
                return res.status(404).send({ status: 'error', error: 'Cart or User not found' });
            }
            // const totalAmount = cart.products.forEach(product => {
            //     product.price * product.quantity
            // });
            console.log(totalAmount);
            // const totalAmount = cart.totalAmount;
            const newTicket = {
                code: Math.random().toString(36).substr(2, 9).toUpperCase(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email // Ensure you're passing ObjectId here
            };

            const createdTicket = await this.ticketService.createTicket(newTicket);
            return createdTicket;
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    };

    getTicket = async (req, res) => {
        const { tid } = req.params;
        const ticketFound = await ticketService.getTicket({ _id: tid });
        try {
            if (!ticketFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el ticket con el id ${tid}` });
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