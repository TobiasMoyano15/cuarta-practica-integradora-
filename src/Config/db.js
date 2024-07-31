import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { program } from '../util/commander.js';

const { mode } = program.opts();
dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.development'
});

export const objectConfig = {
  port: process.env.PORT || 8080,
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  github_ClientID: process.env.GITHUB_CLIENT_ID,
  github_ClientSecret: process.env.GITHUB_CLIENT_SECRET,
  github_CallbackURL: process.env.GITHUB_CALLBACK_URL,
  mongo_url: process.env.MONGO_URL,
  mongo_local_url: process.env.MONGO_LOCAL_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASS,
  admin_cart: process.env.ADMIN_CART,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
  persistence: process.env.PERSISTENCE,
  environment: process.env.ENVIRONMENT
};


export const connectMongoDb = async () => {
  console.log('Base de datos conectada');
  connect(process.env.MONGO_URL);
};