import dotenv from 'dotenv';
import { connect } from 'mongoose';

// Configuración de dotenv
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env.development'
});

// Definición de las configuraciones en un objeto
const objectConfig = {
  port: process.env.PORT || 8080,
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  github_ClientID: process.env.GITHUB_CLIENT_ID,
  github_ClientSecret: process.env.GITHUB_CLIENT_SECRET,
  github_CallbackURL: process.env.GITHUB_CALLBACK_URL,
  mongo_url: process.env.MONGO_URL,
  mongo_local_url: process.env.MONGO_LOCAL_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASS,
  admin_cart: process.env.ADMIN_CART
};

// Función para conectar a MongoDB
const connectMongoDB = async () => {
    try {
        // URL de conexión correcta para mongoose desde las variables de entorno
        await connect(objectConfig.mongo_url);
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

export { objectConfig, connectMongoDB };
