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

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     description: Create a new shopping cart
 *     tags:
 *       - Carts
 *     responses:
 *       201:
 *         description: Cart created successfully
 */
router.post('/', createCart);

/**
 * @swagger
 * /carts/{cid}/purchase:
 *   post:
 *     summary: Purchase the items in the cart
 *     description: Complete the purchase for the items in the cart. Only accessible by authenticated users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase completed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:cid/purchase', passportCall('jwt'), authorizationJwt('user'), purchase);

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a product to the cart. Only accessible by authenticated users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to add
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:cid/products/:pid', passportCall('jwt'), authorizationJwt('user', 'premium'), addProductToCart);

/**
 * @swagger
 * /carts/{cid}:
 *   get:
 *     summary: Retrieve a cart
 *     description: Retrieve a cart by its ID
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *     404:
 *       description: Cart not found
 */
router.get('/:cid', getCart);

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   put:
 *     summary: Update a product in the cart
 *     description: Update the quantity of a product in the cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated product quantity
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             example:
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Cart or product not found
 */
router.put('/:cid/products/:pid', updateProductFromCart);

/**
 * @swagger
 * /carts/{cid}:
 *   put:
 *     summary: Update a cart
 *     description: Update the entire cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated cart object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *             example:
 *               items:
 *                 - productId: "1"
 *                   quantity: 2
 *                 - productId: "2"
 *                   quantity: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 */
router.put('/:cid', updateCart);

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Delete a product from the cart
 *     description: Remove a product from the cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       404:
 *         description: Cart or product not found
 */
router.delete('/:cid/products/:pid', deleteProductFromCart);

/**
 * @swagger
 * /carts/{cid}:
 *   delete:
 *     summary: Delete a cart
 *     description: Remove a cart by its ID
 *     tags:
 *       - Carts
 *     parameters:
 *       - name: cid
 *         in: path
 *         required: true
 *         description: ID of the cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart removed successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/:cid', removeCart);

export default router;
