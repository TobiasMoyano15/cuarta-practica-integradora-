import mongoose from "mongoose";

const collection = "categories";

const schema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  subCategories:[]
});

export const categoryModel = mongoose.model(collection, schema);