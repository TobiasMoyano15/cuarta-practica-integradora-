import { Router } from 'express';
import { UsersManagerMongo } from '../dao/UsersMongo.js';
import { auth } from '../middlewares/auth.middleware.js';

export const sessionsRouter = Router();

const userService = new UsersManagerMongo;

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!email || !password) return res.status(401).send({ status: 'error', error: `Faltan campos, ingresa email y password` });

        const userExist = await userService.getUserBy({ email });
        if (userExist) return res.status(401).send({ status: 'error', error: `El usuario con el email ${userExist.email} ya existe` });

        const newUser = {
            first_name,
            last_name,
            email,
            password
        };

        const result = await userService.createUser(newUser);
        console.log(result);
        return res.redirect('/login');
    } catch (error) {
        console.log('error');
    }
});

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

    if (!email || !password) return res.status(401).render('login.hbs', ({ status: 'error', error: `Faltan campos, ingresa email y password` }));

    const userFound = await userService.getUserBy({ email, password });
    if (!userFound) return res.status(401).render('login.hbs', ({ status: 'error', error: `Usuario y/o contraseña no coinciden` }));

    req.session.user = {
        email,
        role: userFound.role,
    };

    console.log(req.session.user);
    res.redirect('/products');
});


sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.render('/login');
    });
});

sessionsRouter.get('/current', auth, (req, res) => {
    res.send('datos sensibles');
});