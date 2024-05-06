//import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import { __dirname } from '../utils/utils.js';
import { readFile, writeFile } from "../utils/utils.js";
/* import { productModel } from './models/product.model.js';
import { isExist } from "../utils.js"; */
import {dirname} from "path"



export default class FSProductManager {
  constructor() {
    (this.path = `${dirname(__dirname)}/products.json`)
  }


  codeValidation = async(product, products) =>{
    const codeIsExist = products.some(p => product.code === p.code)
    return codeIsExist
  }

  addProduct = async (object) => {
    try {
      const products = await readFile(this.path)
    if (this.codeValidation(object,products)) {
      return {status:"Failed", payload: "El codigo corresponde a otro producto"}
    }

      const newProduct = {
        code: object.code,
        category: object.category,
        title: object.title,
        description: object.description,
        price: parseFloat(object.price),
        thumbnail: object.thumbnail,
        stock: parseInt(object.stock),
        status: true,
        id: uuidv4()
      }

      products.push(newProduct)
      await writeFile(products,this.path) 
      return ({status: "success", payload: newProduct})

    } catch (error) {
      console.log(error);
    }
  };

  getProducts = async() => {
    const products = await readFile(this.path)
    return products;
  }

  getProductById = async(id) =>{
    try{
    const products = await readFile(this.path)
    const productFound = products.find((product) => product.id === id);
    return productFound;
  } catch (error) {
    console.log(error);
  }
}

deleteProduct = async(id) =>{
try{
  const products = await readFile(this.path)
  const indexToDelete = products.findIndex(p => p.id === id)
  if(indexToDelete < 0) return ({status:"failed", payload:"No se ha encontrado el producto que desea borrar"})
  products.splice(indexToDelete,1)
  await writeFile(products,this.path) 
  return({status:"success", payload: 'Producto Borrado Exitosamente'})
} catch (error) {
  console.log(error);
}
}

updateProduct = async(id,productToUpdate) =>{
  const products = await readFile(this.path)
  const indexToUpdate = products.findIndex(p => p.id === id)
  if(indexToUpdate < 0) return ({status:"failed", payload:"No se ha encontrado el producto que desea modificar"})
  if(this.codeValidation(productToUpdate,products)){
    return {status:"Failed", payload: "El codigo corresponde a otro producto"}
  }
  //const productToUpdate = JSON.parse(product)
  const updatedProduct = {
      code: productToUpdate.code === ""? productNotUpdated.code : productToUpdate.code,
      title: productToUpdate.title === ""? productNotUpdated.title : productToUpdate.title,
      description: productToUpdate.description === ""? productNotUpdated.description : productToUpdate.description,
      price: productToUpdate.price === ""? productNotUpdated.price : productToUpdate.price,
      thumbnail: productToUpdate.thumbnail === ""? productNotUpdated.thumbnail : productToUpdate.thumbnail,
      stock: productToUpdate.stock === ""? productNotUpdated.stock : productToUpdate.stock,
      category: productToUpdate.category === ""? productNotUpdated.category : productToUpdate.category,
      status: true,
      id
  }
  await writeFile(products,this.path) 
  return({status:"success", payload: updatedProduct})
}

}