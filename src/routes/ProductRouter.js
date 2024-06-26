import { Router } from 'express';
import ProductController from '../Controllers/products.controller.js';

const router = Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router.get('/', getProducts);
router.get('/:pid', getProduct);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;