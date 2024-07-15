import { cartService, productService, ticketService } from "../Service/service.js";

class CartController {
    constructor() {
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService;
    }

    getCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
            res.status(200).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.addNewCart();
            res.status(201).send({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const product = await this.productService.getProductsById(pid);
            if (!product) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });

            let quantity = req.body.quantity || 1;
            const updatedCart = await this.cartService.addProductToCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const product = await this.productService.getProductsById(pid);
            if (!product) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });

            await this.cartService.updateProductFromCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            await this.cartService.updateCart(cid, products);
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const productFound = await this.productService.getProductsById(pid);
            if (!productFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });

            await this.cartService.deleteProductFromCart(cid, pid);
            res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    deleteCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cartFound = await this.cartService.getCartBy({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            await this.cartService.deleteCart(cid);
            res.status(200).send({ status: 'success', payload: `El carrito ${cid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    generateUniqueCode = async () => {
        let code;
        let exists = true;
        while (exists) {
            code = Math.random().toString(36).substr(2, 9).toUpperCase();
            exists = await this.ticketService.getTicket({ code });
        }
        return code;
    };

    purchase = async (req, res) => {
        const { cid } = req.params;
        const user = req.user;

        try {
            const cart = await this.cartService.getCartBy({ _id: cid });
            if (!cart) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const productsToProcess = [];
            const productsNotProcessed = [];

            for (const item of cart.products) {
                const product = await this.productService.getProductsById(item.product);
                if (!product) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${item.product}` });

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await this.productService.updateProduct(product._id, product);
                    productsToProcess.push(item.product);
                } else {
                    productsNotProcessed.push(item.product);
                }
            }

            cart.products = cart.products.filter(item => !productsNotProcessed.includes(item.product));
            await this.cartService.updateCart(cid, cart.products);

            const totalAmount = cart.products.reduce((total, item) => {
                const product = this.productService.getProductsById(item.product);
                const quantity = item.quantity;
                return total + (product.price * quantity);
            }, 0);

            const newTicket = {
                cartId: cart._id,
                userId: user._id,
                totalAmount,
                code: await this.generateUniqueCode()
            };

            const createdTicket = await this.ticketService.createTicket(newTicket);
            return res.status(200).send({ status: 'success', payload: createdTicket });
        } catch (error) {
            console.error('Error during purchase:', error);
            res.status(500).send({ status: 'error', error: { message: error.message, stack: error.stack } });
        }
    };
}

export default CartController;
