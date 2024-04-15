import express from 'express';
import { ProductManager } from '../managers/ProductManager';

const router = express.Router();
const productsFile = './files/products.json';
const productManager = new ProductManager(productsFile);

// GET /api/products/
router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = await productManager.getAllProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/
router.post('/', async (req, res, next) => {
  try {
    const newProduct = req.body;
    const product = await productManager.addProduct(newProduct);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const product = await productManager.updateProduct(productId, updatedFields);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    await productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;