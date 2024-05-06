import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({
  products:[]
});

export const cartModel = mongoose.model(collection, schema);