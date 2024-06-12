import { Router } from 'express';
import CartsMongoManager from '../dao/CartMongo.manager.js';
import ProductsMongo from '../dao/ProductsMongo.js';

const router = Router();
const cartService = new CartsMongoManager();
const productService = new ProductsMongo();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.addNewCart();
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        }
        res.status(200).send({ status: 'success', payload: cartFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        }
        
        const product = await productService.getProductsById(pid);
        if (!product) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }

        let quantity = 1;
        await cartService.addProductToCart(cid, pid, parseInt(quantity));
        res.status(201).send({ status: 'success', payload: cartFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        }
        
        const product = await productService.getProductsById(pid);
        if (!product) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }

        await cartService.updateProductFromCart(cid, pid, parseInt(quantity));
        res.status(201).send({ status: 'success', payload: cartFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        }
        
        await cartService.updateCart(cid, products);
        res.status(201).send({ status: 'success', payload: cartFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });
        }
        
        const productFound = await productService.getProductsById(pid);
        if (!productFound) {
            return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
        }
        
        await cartService.deleteProductFromCart(cid, pid);
        res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cartFound = await cartService.getCartById(cid);
        if (!cartFound) {
            return res.status(400).send({ status: 'error', error: `¡Error! No existe el carrito` });
        }
        
        await cartService.deleteCart(cid);
        res.status(200).send({ status: 'success', payload: cartFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;
