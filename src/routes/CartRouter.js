import express from 'express';
import { CartManager } from '../managers/CartManager.js';

const router = express.Router();
const cartsFile = './files/carts.json';
const cartManager = new CartManager(cartsFile);

// POST /api/carts/
router.post('/', async (req, res, next) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    next(err);
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Quantity should be a positive number' });
    }

    const cart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

export default router;