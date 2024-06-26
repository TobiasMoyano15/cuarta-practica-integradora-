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

const userService = new UsersManagerMongo();
const cartsService = new CartsMongoManager(); // Assuming correct import and usage of CartsMongoManager

// GitHub authentication
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

// Registro de usuarios
sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!email || !password) return res.status(401).send({ status: 'error', error: 'Faltan campos, ingresa email y password' });

        const userExist = await userService.getUserBy({ email });
        if (userExist) return res.status(401).send({ status: 'error', error: `El usuario con el email ${userExist.email} ya existe` });

        const newCart = await cartsService.addNewCart(); // Assuming addNewCart() is a method in CartsMongoManager
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password), // Encripta la contraseña
            cart: newCart._id // Assuming newCart has an _id property
        };

        await userService.createUser(newUser);
        return res.status(200).send({ status: 'success', message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.log('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor intentalo nuevamente' });
    }
});

// Login de usuarios
sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Admin hardcodeado
    const adminEmail = 'adminCoder@coder.com';
    const adminPassword = 'adminCod3r123';

    if (email === adminEmail && password === adminPassword) {
        req.session.user = {
            email: adminEmail,
            role: 'admin',
        };
        return res.redirect('/products');
    }

    if (!email || !password) return res.status(401).render('login.hbs', { status: 'error', error: 'Faltan campos, ingresa email y password' });

    const userFound = await userService.getUserBy({ email });
    if (!userFound) return res.status(401).render('login.hbs', { status: 'error', error: 'Usuario no encontrado' });

    if (!isValidPassword(password, { password: userFound.password })) return res.status(401).send({ status: 'error', error: 'Password incorrecto' });

    req.session.user = {
        email,
        role: userFound.role,
    };

    res.redirect('/products');
});

// Logout de usuarios
sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.redirect('/login');
    });
});

// Ruta protegida
sessionsRouter.get('/current', auth, (req, res) => {
    res.send(`Datos sensibles para el Rol: ${req.user.role}`);
});
