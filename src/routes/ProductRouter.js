import { Router } from 'express';
import ProductController from '../Controllers/products.controller.js';
import { passportCall } from '../util/passportCall.js';
import { authorizationJwt } from '../util/authorizationJwt.js';

const router = Router();
const {
    createProduct,
    getProducts,
    getProductBy,
    updateProduct,
    removeProduct
} = new ProductController();

router.post('/', passportCall('jwt'), authorizationJwt('admin'),createProduct);
router.get('/', getProducts);
router.get('/:pid', getProductBy);
router.put('/:pid', passportCall('jwt'), authorizationJwt('admin'),updateProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin'),removeProduct);

export default router;