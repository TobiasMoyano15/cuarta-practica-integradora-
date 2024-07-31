import { Router } from 'express';
import CartController from '../Controllers/carts.controller.js';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { passportCall } from '../util/passportCall.js';


const router = Router();
const {
    createCart,
    addProductToCart,
    purchase,
    getCart,
    updateProductFromCart,
    updateCart,
    deleteProductFromCart,
    removeCart
} = new CartController();

router.post('/', createCart);
router.post('/:cid/purchase', passportCall('jwt'), authorizationJwt('user'), purchase);
router.post('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('user', 'premium'), addProductToCart);
router.get('/:cid', getCart);
router.put('/:cid/products/:pid', updateProductFromCart);
router.put('/:cid', updateCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', removeCart);

export default router;