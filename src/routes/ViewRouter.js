import { Router } from "express";
import { __dirname } from '../FileNameUtil.js'
import ProductsMongoManager from "../dao/ProductsMongo.manager.js";
import CartsMongoManager from "../dao/CartMongo.manager.js";


const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const productService = new ProductsMongoManager();
const cartService = new CartsMongoManager();

const router = Router()

router.get('/products', async (req, res) => {
    const { limit = 10, pageNum = 1, category, status, product:title, sortByPrice } = req.query
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({ limit, pageNum, category, status, title, sortByPrice })

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
        availability: status
    })
})

router.get('/product/:pid', async (req, res) => {
    const { pid } = req.params;
    
    const product = await productService.getProductsById(pid)
    // cart Id hardcodeado para probar el boton agregar al carrito
    const cartId =  '6641b6b5b2cc19ccdc4776eb'
    res.render('./product.hbs', {product, cartId} )
})

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;

    const cart = await cartService.getCartById(cid)
    res.render('./cart.hbs', { cart })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('./realtimeproducts.hbs', {})
})

router.get('/chat', async (req, res) => {
    res.render('./chat.hbs', {})
})
export default router