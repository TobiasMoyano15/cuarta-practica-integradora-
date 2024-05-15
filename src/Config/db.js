import { connect } from 'mongoose'


const connectMongoDB = () => {
    
    connect('mongosh "mongodb+srv://cluster0.ebidatw.mongodb.net/" --apiVersion 1 --username tobiasmoyano09')
    console.log('Base de datos conectada')
}


export default connectMongoDB