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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product. Only accessible by admin or premium users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     requestBody:
 *       description: Product object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               name: Laptop
 *               price: 999.99
 *               description: A high-end laptop
 *               category: Electronics
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', passportCall('jwt'), authorizationJwt('admin', 'premium'), createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products from the database.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Retrieve a single product
 *     description: Retrieve a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *       404:
 *         description: Product not found
 */
router.get('/:pid', getProductBy);

/**
 * @swagger
 * /products/{pid}:
 *   put:
 *     summary: Update a product
 *     description: Update a product by its ID. Only accessible by admin or premium users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Product object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               name: Updated Laptop
 *               price: 899.99
 *               description: An updated high-end laptop
 *               category: Electronics
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.put('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), updateProduct);

/**
 * @swagger
 * /products/{pid}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by its ID. Only accessible by admin or premium users.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - name: pid
 *         in: path
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.delete('/:pid', passportCall('jwt'), authorizationJwt('admin', 'premium'), removeProduct);

export default router;
