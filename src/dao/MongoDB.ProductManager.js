//import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { __dirname } from '../utils/utils.js';
import { readFile, writeFile } from "../utils/utils.js";
import { categoryModel } from './models/category.model.js';
import { productModel } from './models/product.model.js';
//import { isExist } from "../utils.js";
import {dirname} from "path"



export default class MDBProductManager {
  constructor() {
    (this.path = `${dirname(__dirname)}/products.json`)
  }

  calculatePrice = (cost,markdown) =>{
    const retailPrice = cost + ((cost * markdown) / 100)
    return retailPrice
  }

  addProduct = async (object) => {
    try {
      const query = productModel.where({code: object.code})
      const codeValidation = await query.findOne().lean()
    if (codeValidation) {
      console.log('Error');
      return {status:"Failed", payload: "El codigo corresponde a otro producto"}
    }

      const newProduct = await productModel.create({
        code: object.code,
        category: object.category,
        subCategory: object.subCategory,
        title: object.title,
        description: object.description,
        brand: object.brand,
        provider: object.provider,
        cost: object.cost,
        markdown: object.markdown,
        price: this.calculatePrice(object.cost,object.markdown),
        thumbnail: object.thumbnail,
        stock: parseInt(object.stock),
        status: true
      });

      return ({status: "success", payload: newProduct})

    } catch (error) {
      console.log(error);
    }
  };

  addProducts = async (products) =>{
    try{
          const dataProcessed = products.map(product => {
          return {
          code: product.code,
          category: product.category,
          subCategory: product.subCategory,
          title: product.title,
          description: product.description,
          brand: product.brand,
          provider: product.provider,
          cost: parseFloat(product.cost),
          markdown: parseFloat(product.markdown),
          price: this.calculatePrice(product.cost,product.markdown),
          thumbnail: product.thumbnail,
          stock: parseInt(product.stock),
          status: true
        }});
        await productModel.insertMany(dataProcessed)
      } catch (error) {
      console.log(error);
    }
  }

  getProducts = async() => {
    const products = await productModel.find().lean()
    return products;
  }

 getProductById = async(id) =>{
    try{
    const productFound = await productModel.findById(id).lean()
    return productFound;
  } catch (error) {
    console.log(error);
  }
}
 

getProductsCategories = async()=>{
const categories = await productModel.find({},{category:1})
return categories
}

deleteProduct = async(id) =>{
try{
 /*  const products = await readFile(this.path)
  const indexToDelete = products.findIndex(p => p.id === id)
  if(indexToDelete < 0) return ({status:"failed", payload:"No se ha encontrado el producto que desea borrar"})
  products.splice(indexToDelete,1)
  await writeFile(products,this.path) */
  await productModel.findByIdAndDelete(id)
  return({status:"success", payload: 'Producto Borrado Exitosamente'})
} catch (error) {
  console.log(error);
}
}

updateProduct = async(id,productToUpdate) =>{
  const productNotUpdated = await productModel.findById(id).lean()
  const updatedProduct = {
      code: productToUpdate.code === ""? productNotUpdated.code : productToUpdate.code,
      title: productToUpdate.title === ""? productNotUpdated.title : productToUpdate.title,
      description: productToUpdate.description === ""? productNotUpdated.description : productToUpdate.description,
      cost: productToUpdate.cost === ""? productNotUpdated.cost : productToUpdate.cost,
      markdown: productToUpdate.markdown === ""? productNotUpdated.markdown : productToUpdate.markdown,
      price: this.calculatePrice(productToUpdate.cost,productToUpdate.markdown),
      thumbnail: productToUpdate.thumbnail === ""? productNotUpdated.thumbnail : productToUpdate.thumbnail,
      stock: productToUpdate.stock === ""? productNotUpdated.stock : productToUpdate.stock,
      category: productToUpdate.category === ""? productNotUpdated.category : productToUpdate.category,
      subCategory: productToUpdate.subCategory === ""? productNotUpdated.subCategory : productToUpdate.subCategory,
      status: true,
  }
  await productModel.findOneAndUpdate({_id:id}, updatedProduct, {new:true})
  return({status:"success", payload: updatedProduct})
}

// CRUD de categorias:

addCategory = async(category) =>{
  const newCategory = await categoryModel.create({categoryName:category.categoryName, subCategories:[]})
  return ({status:"success", payload: newCategory})
}

addSubCategory = async(newSubCategory) =>{
  const subCategoryToAdd = await categoryModel.findOneAndUpdate(
    {categoryName:newSubCategory.categoryName},
    { $addToSet: { subCategories: { _id: uuidv4(), subCategoryName: newSubCategory.subCategoryName} } },
    { new: true, upsert: true }
    )
  return ({status:"success", payload: subCategoryToAdd})
}

getCategories = async() =>{
  const categories = await categoryModel.find().lean()
  return categories
}

//Falta terminar:
getSubCategories = async(category) =>{
  const categories = await categoryModel.find().lean()
  return categories
}


}