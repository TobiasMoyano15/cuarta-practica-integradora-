import { Router } from 'express';
import { __dirname } from '../FileNameUtil.js'
import ProductDao from '../dao/ProductsFS.manager.js';
import realTimeProductController from '../Controllers/realTimeProductsController.js';

const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const router = Router();
const { getProducts, addProduct } = new ProductDao(productsJsonPath);

const {
    getRealTimeProducts,
    createRealTimeProduct
} = new realTimeProductController()

router.get('/', getRealTimeProducts);
router.post('/', createRealTimeProduct);

export default router;