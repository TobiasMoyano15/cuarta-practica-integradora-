import passport from 'passport';
import { UsersManagerMongo } from '../daos/usersManagerMongo.js';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { PRIVATE_KEY, generateToken } from '../utils/jsonwebtoken.js';
import CartsMongoManager from '../daos/cartsManagerMongo.js';
import dotenv from 'dotenv';
import { objectConfig } from './db.js';

// Configuración de dotenv
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env.development'
});

// Definición de las configuraciones en un objeto
const { github_CallbackURL, github_ClientSecret, github_ClientID } = objectConfig;
const userService = new UsersManagerMongo();
const cartsService = new CartsMongoManager();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            if (!jwt_payload) return done(null, false, { message: 'Usuario no encontrado' });
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: github_ClientID,
        clientSecret: github_ClientSecret,
        callbackURL: github_CallbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.getUserBy({ email: profile._json.login });
            const newCart = await cartsService.addNewCart();
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.login,
                    password: '',
                    cartID: newCart._id
                };
                let result = await userService.createUser(newUser);
                user = result;
            }
            const token = generateToken({ id: user._id, email: user.email, role: user.role, cartID: newCart._id });
            user.token = token;

            done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.getUserBy({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
