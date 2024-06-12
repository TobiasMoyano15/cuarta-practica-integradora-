import passport from 'passport';
import { UsersManagerMongo } from '../daos/usersManagerMongo.js';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { PRIVATE_KEY, generateToken } from '../utils/jsonwebtoken.js';
import CartsMongoManager from '../daos/cartsManagerMongo.js';

const LocalStrategy = local.Strategy;
const userService = new UsersManagerMongo();
const cartsService = new CartsMongoManager();

export const initializePassport = () => {
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name } = req.body;
        try {
            let userFound = await userService.getUserBy({ email: username });
            if (userFound) {
                console.log('El usuario ya existe');
                return done(null, false);
            }
            let newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(password) // Use password instead of username for hashing
            };
            let result = await userService.createUser(newUser);
            return done(null, result);
        } catch (error) {
            return done(`Error al registrar usuario ${error}`);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userService.getUserBy({ email: username });
            if (!user) {
                console.log('Usuario no encontrado');
                return done(null, false);
            }
            if (!isValidPassword(password, user.password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('jwt', new jwt.Strategy({
        jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
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
        clientID: 'Iv23liQxo01u9lMy7LxQ',
        clientSecret: 'fe4104715d07c3b0f2c65f81e450feaf9f659d08',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
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
