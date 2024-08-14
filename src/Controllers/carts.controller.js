import { cartService, productService, ticketService ,userService} from "../Service/service.js";
import { logger } from "../util/logger.js";

class CartController {
    constructor() {
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService
        this.userService = userService
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).send({ status: 'success', payload: newCart });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        const user = req.user
        try {
            const cartFound = await this.cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
            const product = await this.productService.getProduct({ _id: pid });
            if (!product) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            // const userFound = await userService.getUser(uid)
            logger.info(user.role)
            if (user.role === 'premium' && product.owner === user.email ) return res.status(401).send({ status: 'error', error: `el usuario ${user.email} creó el producto ${product} por lo tanto no puede agregarlo a su carrito` });
            
            let quantity = req.body.quantity || 1;

            const updatedCart = await this.cartService.addProductToCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: updatedCart });
        } catch (error) {
            logger.error('Error agregando producto al carrito:', error);
            res.status(500).send({ status: 'error', error: error });
        }
    };

    getCart = async (req, res) => {
        const { cid } = req.params;
        const cartFound = await this.cartService.getCart({ _id: cid });
        try {
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
            res.status(200).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cartFound = await this.cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const product = await this.productService.getProduct({ _id: pid });
            if (!product) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            await cartService.updateProductFromCart(cid, pid, parseInt(quantity));
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;
        
        try {
            const cartFound = await this.cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            await cartService.updateCart(cid, products);
            res.status(201).send({ status: 'success', payload: cartFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;

        try {
            const cartFound = await this.cartService.getCart({ _id: cid });
            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

            const productFound = await this.productService.getProduct({ _id: pid });
            if (!productFound) {
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
            }
            await cartService.deleteProductFromCart(cid, pid);
            res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };
    removeCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cartFound = await this.cartService.getCart({ _id: cid });

            if (!cartFound) return res.status(400).send({ status: 'error', error: `¡Error! No existe el carrito` });
            res.status(200).send({ status: 'success', payload: cartFound });
            cartService.removeCart(cid);
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    };

    generateUniqueCode = async () => {
        let uniqueCode;
        let codeExists = true;

        while (codeExists) {
            uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const existingTicket = await this.ticketService.getTicket({ uniqueCode });
            if (!existingTicket) {
                codeExists = false;
            }
        }

        return uniqueCode;
    };

    purchase = async (req, res) => {
        const { cid } = req.params;
        const user = req.user;

        try {
            const cart = await cartService.getCart({ _id: cid });
            if (!cart) {
                throw new Error('Cart not found');
            }

            let productsToProcess = [];
            let productsNotProcessed = [];
            let totalAmount = 0;

            for (const item of cart.products) {
                const product = await this.productService.getProduct(item.product);
                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }
                if (product.stock >= item.quantity) {
                    productsToProcess.push(item);
                    totalAmount += product.price * item.quantity;
                } else {
                    productsNotProcessed.push(item);
                }
            }
            productsNotProcessed.forEach(product => {
                return product._id
            });
            if (productsToProcess.length === 0) throw new Error('No hay productos para procesar');

                const uniqueCode = await this.generateUniqueCode();
                const newTicket = {
                    code: String(uniqueCode),
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: user.email
                };
                const createdTicket = await this.ticketService.createTicket(newTicket);
                for (const item of productsToProcess) {
                    let updateProductStock = await this.productService.updateProduct(item.product._id, { stock: -item.quantity });
                }
                cart.products = productsNotProcessed;

                await this.cartService.updateCart(cart._id, cart.products);
                productsToProcess = [];
                productsNotProcessed = [];

                return res.status(200).send({ status: 'success', payload: createdTicket });
        
        } catch (error) {
            logger.error('Error during purchase:', error);
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
}

export default CartController;