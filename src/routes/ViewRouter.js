import { Router } from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ProductsMongoManager from "../dao/ProductsMongo.js";
import CartsMongoManager from "../dao/CartMongo.manager.js";
import UsersMongo from '../dao/UsersMongo.js';
import { auth } from "../middlewares/auth.middleware.js";
import { sessionsRouter } from "./Sessions.router.js";

const productService = new ProductsMongoManager();
const cartService = new CartsMongoManager();
const userService = new UsersMongo();

const router = Router();

// Obtener la ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));

// Redirigir a la página de login
router.get('/', async (req, res) => {
    res.redirect('/login');
});

// Mostrar la página de login
router.get('/login', (req, res) => {
    res.render('login.hbs');
});

// Mostrar la página de registro
router.get('/register', (req, res) => {
    res.render('register.hbs');
});

// Mostrar usuarios con paginación
router.get('/users', auth, async (req, res) => {
    const { numPage, limit } = req.query;
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await userService.getUsers({ limit, numPage });

    res.render('users.hbs', {
        users: docs,
        page,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
    });
});

// Mostrar productos con filtros y paginación
router.get('/products', async (req, res) => {
    const { limit = 10, pageNum = 1, category, status, product: title, sortByPrice } = req.query;
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({ limit, pageNum, category, status, title, sortByPrice });

    let prevLink = null;
    let nextLink = null;

    if (hasPrevPage) {
        prevLink = `/products?pageNum=${prevPage}`;
        if (limit) prevLink += `&limit=${limit}`;
        if (title) prevLink += `&title=${title}`;
        if (category) prevLink += `&category=${category}`;
        if (status) prevLink += `&status=${status}`;
        if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
    }

    if (hasNextPage) {
        nextLink = `/products?pageNum=${nextPage}`;
        if (limit) nextLink += `&limit=${limit}`;
        if (category) nextLink += `&category=${category}`;
        if (status) nextLink += `&status=${status}`;
        if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
    }

    return res.render('./index.hbs', {
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
        category,
        sortByPrice,
        availability: status,
        email: req.session.user.email,
        role: req.session.user.role
    });
});

// Mostrar un producto específico
router.get('/product/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productService.getProductById(pid); // Cambiado a getProductById para reflejar el método adecuado
    const cartId = '6641b6b5b2cc19ccdc4776eb';  // ID del carrito hardcodeado para pruebas
    res.render('./product.hbs', { product, cartId });
});

// Mostrar un carrito específico
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid); // Cambiado a getCartById para reflejar el método adecuado
    res.render('./cart.hbs', { cart });
});

// Mostrar productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    res.render('./realtimeproducts.hbs', {});
});

// Mostrar la página de chat
router.get('/chat', async (req, res) => {
    res.render('./chat.hbs', {});
});

export default router;
