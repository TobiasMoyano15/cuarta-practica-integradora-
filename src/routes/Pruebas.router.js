import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js'; // Ajusta la ruta de importación del middleware
import { passportCall } from '../util/passportCall.js';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { userService } from '../service/service.js';

const router = Router();

router.get('/current', passportCall('jwt'), authorizationJwt('user'), async (req, res) => {
    const {uid} = req.params
    const user = await userService.getUsers({_id: uid});

    res.render('user.hbs', {user});

});
// router.get('/current', passportCall('jwt'), authorizationJwt('user'), (req, res) => {
//     res.send('datos sensibles que solo puede ver el admin');
// });

router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send('Bienvenidos');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({ status: 'error', error: err });
        else return res.send('logout');
    });
});

router.get('/setCookie', (req, res) => {
    res.cookie('CoderCookie', 'Esta es una cookie muy poderosa', { maxAge: 10000000 }).send('cookie');
});
router.get('/setCookieSigned', (req, res) => {
    res.cookie('CoderCookie', 'Esta es una cookie muy poderosa', { maxAge: 10000000, signed: true }).send('cookie signed');
});

router.get('/getCookie', (req, res) => {
    res.send(req.signedCookies);
});
router.get('/deleteCookie', (req, res) => {
    res.clearCookie('CoderCookie').send('cookie borrada');
});

export default router;