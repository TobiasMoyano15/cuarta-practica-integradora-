import jwt from 'jsonwebtoken';
import { objectConfig } from '../Config/db.js';
const { jwt_private_key } = objectConfig;

export const PRIVATE_KEY = jwt_private_key;

export const generateToken = (user) => jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' });

export const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ status: 'error', error: 'el usuario no esta autenticado' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if (error) return res.status(401).send({ status: 'error', error: 'el usuario no esta autorizado' });
        req.user = credential.user;
        next();
    });
};