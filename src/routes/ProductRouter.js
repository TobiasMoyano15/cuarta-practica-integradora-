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

router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium'),createProduct);
router.get('/', getProducts);
router.get('/:pid', getProductBy);
router.put('/:pid',passportCall('jwt'), authorizationJwt('admin', 'premium'), updateProduct);
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), removeProduct);

export default router;