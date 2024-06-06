import { connect } from 'mongoose';

const connectMongoDB = async () => {
    try {
        // URL de conexión correcta para mongoose
        await connect('mongodb+srv://tobiasmoyano09:<password>@cluster0.ebidatw.mongodb.net/<database>?retryWrites=true&w=majority');
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
}

export default connectMongoDB;
