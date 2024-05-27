import { Router } from 'express';
import { __dirname } from '../FileNameUtil.js';
import CartsMongoManager from '../dao/CartMongo.manager.js';
import ProductsMongoManager from '../dao/ProductsMongo.manager.jss';


const router = Router();
const cartService = new CartsMongoManager;
const productService = new ProductsMongoManager;


router.post('/', async (req, res) => {

    const newCart = await cartService.addNewCart();
    res.status(201).send({ status: 'success', payload: newCart });

});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartFound = await cartService.getCartById(cid);

    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    res.status(200).send({ status: 'success', payload: cartFound });

});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cartFound = await cartService.getCartById(cid);


    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    const product = await productService.getProductsById(pid);

    if (!product) {
        return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
    }
    let quantity = 1;

    await cartService.addProductToCart(cid, pid, parseInt(quantity));
    res.status(201).send({ status: 'success', payload: cartFound });
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartFound = await cartService.getCartById(cid);
    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    const product = await productService.getProductsById(pid);
    if (!product) {
        return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
    }

    await cartService.updateProductFromCart(cid, pid, parseInt(quantity));
    res.status(201).send({ status: 'success', payload: cartFound });
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;

    const cartFound = await cartService.getCartById(cid);
    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    await cartService.updateCart(cid, products);
    res.status(201).send({ status: 'success', payload: cartFound });

});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartFound = await cartService.getCartById(cid);
    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el carrito con el id ${cid}` });

    const productFound = await productService.getProductsById(pid);
    if (!productFound) {
        return res.status(400).send({ status: 'error', error: `¡ERROR! No existe el producto con el id ${pid}` });
    }
    await cartService.deleteProductFromCart(cid, pid);
    res.status(201).send({ status: 'success', payload: `El producto ${pid} ha sido eliminado del carrito ${cid}` });
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cartFound = await cartService.getCartById(cid);

    if (!cartFound) return res.status(400).send({ status: 'error', error: `¡Error! No existe el carrito` });
    res.status(200).send({ status: 'success', payload: cartFound });
    cartService.deleteCart(cid);
});



export default router;