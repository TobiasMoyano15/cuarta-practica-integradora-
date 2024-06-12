import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: {
        type: String,
        enum: ["cafe", "te", "comestibles", "jugos"] // Corregido "emum" a "enum"
    },
    thumbnails: String
});

productsSchema.plugin(mongoosePaginate);

const productsModel = model('products', productsSchema);
export default productsModel;
