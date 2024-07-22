import { Router } from "express";
import { passportCall } from "../util/passportCall.js";
import { authorizationJwt } from "../util/authorizationJwt.js";
import { productService, cartService, userService ,ticketService } from "../Service/service.js";
import UserDto from "../dtos/usersDto.js";
import UserSecureDto from "../dtos/userSecureDto.js";
import generateProductsMock from "../util/generateProductsMock.js";


const router = Router();

router.get('/', async (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login.hbs');
});

router.get('/register', (req, res) => {
    res.render('register.hbs');
});

router.get('/users', passportCall('jwt'), authorizationJwt('admin', 'user'), async (req, res) => {
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

router.get('/current', passportCall('jwt'), authorizationJwt('user'), async (req, res) => {
    const {id} = req.user
    const user = await userService.getUser({_id:id})
    const secureUser = new UserSecureDto(user);

    res.render('user.hbs', {user:secureUser});
});

router.get('/products', passportCall('jwt'), authorizationJwt('admin', 'user'),  async (req, res) => {
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
        if (title) nextLink += `&product=${title}`;
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
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart
    });
});

router.get('/product/:pid', passportCall('jwt'), authorizationJwt('admin', 'user'), async (req, res) => {
    const { pid } = req.params;
    const product = await productService.getProduct({_id: pid});
    res.render('./product.hbs', { product, cart: req.user.cart });
});

router.get('/cart/:cid', passportCall('jwt'), authorizationJwt('admin', 'user'), async (req, res) => {
    const { cid } = req.params;
    const cart = await cartService.getCart({_id: cid});
    res.render('./cart.hbs', { cart });
});

router.get('/tickets', passportCall('jwt'), async (req, res) => {
    const { email } = req.user;
    const ticket = await ticketService.getTickets({purchaser: email});
    
    res.render('./tickets.hbs', { ticket, email });
});

router.get('/realtimeproducts', passportCall('jwt'), async (req, res) => {
    res.render('./realtimeproducts.hbs', {});
});

router.get('/chat', passportCall('jwt'), authorizationJwt('user'), async (req, res) => {
    res.render('./chat.hbs', {});
});

router.get('/mockingproducts', (req,res) => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProductsMock())
        
    }
    res.send({status:'success', payload:products})
})

export default router;