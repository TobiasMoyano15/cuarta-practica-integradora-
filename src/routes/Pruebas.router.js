import { Router } from 'express';
import { passportCall } from '../util/passportCall.js';
import { authorizationJwt } from '../util/authorizationJwt.js';
import { userService } from '../Service/service.js';

const router = Router();

router.get('/loggerTest', async (req, res) => {
    req.logger.debug('Log de Debug!')
    // req.logger.http('Log de Http!')
    // req.logger.info('Log de Info!')
    // req.logger.warning('Log de Alerta!')
    // req.logger.error('Log de Error!')
    // req.logger.fatal('Error Fatal!')
    res.send({message: "Prueba Logger"})
})


router.get('/current', passportCall('jwt'), authorizationJwt('user'), async (req, res) => {
    const {uid} = req.params
    const user = await userService.getUsers({_id: uid});

    res.render('users.hbs', {users: user.docs});

});

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