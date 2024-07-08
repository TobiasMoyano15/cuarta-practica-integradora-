import { Router } from 'express';
import { UsersManagerMongo } from '../dao/UsersMongo.js';
import { createHash, isValidPassword } from '../util/bcrypt.js'; 
import passport from 'passport';
import { auth } from '../middlewares/auth.middleware.js';
import { passportCall } from '../util/passportCall.js';
import CartsMongoManager from '../dao/CartMongo.manager.js';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { authTokenMiddleware, generateToken } from '../util/jsonwebtoken.js';

export const sessionsRouter = Router();

const cartController = new CartController;
const {admin_email, admin_password, admin_cart} = objectConfig

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback',
    passport.authenticate('github', { session: false }),
    (req, res) => {
        if (req.user && req.user.token) {
            res.cookie('token', req.user.token, { httpOnly: true });
            res.redirect('/products');
        } else {
            res.status(401).send('Fallo autenticacion');
        }
    });

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!email || !password) return res.status(401).send({ status: 'error', error: `Faltan campos, ingresa email y password` });

        const userExist = await userService.getUser({ email });
        if (userExist) return res.status(401).send({ status: 'error', error: `El usuario con el email ${userExist.email} ya existe` });

        const newCart = await cartService.createCart();
        const newUser = new UserDto({
            first_name,
            last_name,
            email,
            age: parseInt(age) || null,
            password: createHash(password),
            cart: newCart._id
        })
        
        const result = await userService.createUser(newUser);
        const token = generateToken({
            id: result._id,
            email,
            role: result.role,
            cart: result.cart
        });

        return res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
        }).send({ status: 'Success', message: 'Usuario registrado' });

    } catch (error) {
        console.log('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor intentalo nuevamente' });
    }
});

sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Admin hardcodeado
    const adminEmail = admin_email;
    const adminCart = admin_cart
    const adminPassword = admin_password;

    if (email === adminEmail && password === adminPassword) {
        req.user = {
            email: adminEmail,
            role: 'admin',
            cart: adminCart
        };
        return res.status(200).send({ status: 'Success', message: `Admin ${email} Logueado con exito` });
    }

    if (!email || !password) return res.status(401).render('login.hbs', ({ status: 'error', error: `Faltan campos, ingresa email y password` }));

    const userFound = await userService.getUser({ email });
    if (!userFound) return res.status(400).render('login.hbs', ({ status: 'error', error: `Usuario no encontrado` }));

    if (!isValidPassword(password, { password: userFound.password })) return res.status(401).send({ status: 'error', error: 'Password incorrecto' });

    const token = generateToken({
        id: userFound._id,
        email,
        role: userFound.role,
        cart: userFound.cart
    });

    res.cookie('token', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
    }).send({ status: 'success', message: 'Usuario logueado' });
});

sessionsRouter.post('/logout', (req, res) => {
    try {
        res.clearCookie('token');
        return res.redirect('/login');
    } catch (error) {
        console.log('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor intentalo nuevamente' });
    }
});


sessionsRouter.get('/current', passportCall('jwt'), authorizationJwt('admin', 'user'), (req, res) => {
    res.send(`Datos que puede ver el Rol: ${req.user.role}`);
});