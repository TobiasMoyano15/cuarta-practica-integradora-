import { json, Router } from 'express';
import passport from 'passport';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { createHash, isValidPassword } from '../util/bcrypt.js';
import { passportCall } from '../util/passportCall.js';
import { generateToken } from '../util/jsonwebtoken.js';
import { objectConfig } from '../Config/db.js';  // Asegúrate de que esta ruta es correcta
import UserDto from '../../dtos/usersDto.js';     // Asegúrate de que esta ruta es correcta
import { cartService, userService } from '../Service/service.js'; // Asegúrate de que esta ruta es correcta
import { logger } from '../util/logger.js';
import { sendPasswordRecoveryEmail } from '../util/sendPasswordRecoveryEmail.js';
import jwt from 'jsonwebtoken'; // Asegúrate de que esta importación es correcta

export const sessionsRouter = Router();

const { admin_email, admin_password, admin_cart, jwt_private_key } = objectConfig;

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback',
    passport.authenticate('github', { session: false }),
    (req, res) => {
        if (req.user && req.user.token) {
            res.cookie('token', req.user.token, { httpOnly: true });
            res.redirect('/products');
        } else {
            res.status(401).send('Fallo autenticación');
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
        });

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
        logger.error('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor inténtalo nuevamente' });
    }
});

sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = admin_email;
    const adminCart = admin_cart;
    const adminPassword = admin_password;

    if (email === adminEmail && password === adminPassword) {
        req.user = {
            email: adminEmail,
            role: 'admin',
            cart: adminCart
        };
        const token = generateToken({
            email: adminEmail,
            role: 'admin',
            cart: adminCart
        });
        return res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true,
        }).status(200).send({ status: 'Success', message: `Admin ${email} logueado con éxito` });
    }

    if (!email || !password) return res.status(401).render('login.hbs', { status: 'error', error: `Faltan campos, ingresa email y password` });

    const userFound = await userService.getUser({ email });
    if (!userFound) return res.status(400).render('login.hbs', { status: 'error', error: `Usuario no encontrado` });

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

sessionsRouter.post('/logout', passportCall('jwt'), async (req, res) => {
    try {
        res.clearCookie('token');
        return res.redirect('/login');
    } catch (error) {
        logger.error('error:', error);
        return res.status(500).send({ status: 'error', error: 'Ocurrió un error, por favor inténtalo nuevamente' });
    }
});

sessionsRouter.post('/send-password-reset-email', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userService.getUser({ email });

        if (!user) return res.status(400).send({ status: 'error', error: `El usuario con el mail ${email} no existe` });

        const token = generateToken({ id: user._id }, '1h');

        sendPasswordRecoveryEmail({
            email: user.email,
            subject: 'Recuperar contraseña',
            html: `
                <h1>Hola! ${user.first_name} ${user.last_name}</h1>
                <h2>Hacé click en el link para reestablecer tu contraseña</h2>
                <a href="http://localhost:8080/reset-password?token=${token}">Reestablecer contraseña</a>
            `
        });
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).send({ status: 'success', message: 'Email enviado a su casilla' });
    } catch (error) {
        logger.error(error);
        return res.status(500).send({ status: 'error', error: error.message });
    }
});

sessionsRouter.post('/reset-password', passportCall('jwt'), async (req, res) => {
    const { newPassword, newPasswordRetype } = req.body;
    const token = req.headers.authorization;
    const user = req.user;

    if (!newPassword) return res.status(400).send({ status: 'error', error: 'Escribe tu nueva contraseña' });
    if (newPassword !== newPasswordRetype) return res.status(400).send({ status: 'error', error: 'Las contraseñas deben coincidir' });

    const userFound = await userService.getUser({ _id: user.id });

    if (!token) return res.status(400).send({ status: 'error', error: 'Tiempo agotado, vuelve a pedir un link para restablecer la contraseña' });
    if (!userFound) return res.status(400).send({ status: 'error', error: 'Usuario no existe' });
    if (isValidPassword(newPassword, userFound)) return res.status(400).send({ status: 'error', error: 'Debes ingresar una contraseña diferente a la anterior' });

    try {
        await userService.updateUser({ _id: user.id }, {
            password: createHash(newPassword)
        });
        res.status(200).send({ status: 'success', message: 'Contraseña actualizada' });
    } catch (error) {
        logger.error('Error al crear la contraseña nueva:', error);
        res.status(500).send({ status: 'error', error: 'Error' });
    }
});

sessionsRouter.get('/current', passportCall('jwt'), authorizationJwt('admin', 'premium', 'user'), (req, res) => {
    res.status(200).send(`Datos que puede ver el Rol: ${req.user.role}`);
});
