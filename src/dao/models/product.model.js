import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
cost:{
  type: Number,
    required: true
},
markdown: {
  type: Number,
  required: true
},
  price: {
    type: Number,
    required: true,
  },
  thumbnail: String,
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  brand: {
    type: String
  },
  provider: String,
  status: Boolean,
});

export const productModel = mongoose.model(collection, schema);