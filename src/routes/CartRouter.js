import { Router } from 'express';
import CartController from '../Controllers/carts.controller.js';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { passportCall } from '../util/passportCall.js';


const router = Router();
const {
    getCart,
    createCart,
    addProductToCart,
    updateProductFromCart,
    updateCart,
    deleteProductFromCart,
    deleteCart
} = new CartController();

router.get('/:cid', getCart);
router.post('/', createCart);
router.post('/:cid/products/:pid', addProductToCart);
router.put('/:cid/products/:pid', updateProductFromCart);
router.put('/:cid', updateCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', deleteCart);

export default router;
