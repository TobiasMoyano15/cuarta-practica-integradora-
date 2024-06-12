import { Schema, model } from 'mongoose';

const cartsSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }]
});

cartsSchema.pre('findOne', function() {
    this.populate('products.product');
});

const cartsModel = model('carts', cartsSchema); // Corregido el nombre de la variable
export default cartsModel; // Exporta cartsModel en lugar de cartmodel
