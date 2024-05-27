import { Schema, model } from 'mongoose'

const cartsSchema = new Schema({
    // userId: String
    // userEmail: String
        
    products: [{
        product:{
            type: Schema.Types.ObjectId,
            ref:'products'
        },
        quantity: Number
    }]
})

cartsSchema.pre('findOne', function() {
    this.populate('products.product')
})

const cartsModel = model('carts', cartsSchema)
export default cartsModel