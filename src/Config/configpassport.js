import passport from 'passport'
import local from 'passport-local'
import { UserMongo } from '../dao/UsersMongo.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import GithubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;
const userService = new UsersManagerMongo();

export const initializePassport = () => {
    
    passport.use('register', new LocalStrategy({}, async () => {
        passReqToCallback: true; 
        usernameField: 'email';
    }, async (req, username, password, done) => {
        const { first_name, last_name } = req.body;
        try {
            let userFound = await userService.getUserBy({ email: username });
            if (userFound) {
                console.log('el usuario ya existe');
                return done(null, false);
            };
            let newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(username)
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
                console.log('usuario no encotrado');
                return done(null, false);
            }
            if (!isValidPassword(password, { password: user.password })) return done(null, false);
            return done(null, user);
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
            console.log(profile);
            let user = await userService.getUserBy({ email: profile._json.login });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.login,
                    password: ''
                };
                let result = await userService.createUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

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