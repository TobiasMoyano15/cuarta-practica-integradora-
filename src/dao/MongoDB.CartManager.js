import { v4 as uuidv4 } from 'uuid';
import { __dirname } from '../utils/utils.js';
import { readFile, writeFile } from "../utils/utils.js";
import {dirname} from "path"
import { cartModel } from './models/cart.model.js';
import { productModel } from './models/product.model.js';


export default class MDBCartManager {
    constructor() {
      (this.path = `${dirname(__dirname)}/carts.json`)
    }

      addCart = async()=>{
        try {
            const newCart = await cartModel.create({products: []})
            return ({status: "success", payload: newCart})
          } catch (error) {
            console.log(error);
          }
        };

        getProductsByCartId = async(id) =>{
            try{
            const cartFound = await cartModel.findById(id).lean()
            return cartFound.products
          } catch (error) {
            console.log(error);
          }
        }

      

      addProductToCart = async (cid,quantity,pid) =>{
        try{
            const query = cartModel.where({ _id: cid, 'products.id':pid })
            const productExist = await query.findOne()

            if(!productExist){
                const cart = await cartModel.findOneAndUpdate(
                { _id: cid},
                { $addToSet: { products: { id: pid, quantity} } },
                { new: true })
                return ({status: "success", payload: cart})
            }
            
            const addProduct = await cartModel.findOneAndUpdate(
              { _id: cid, 'products.id':pid },
              { $inc: { 'products.$.quantity': quantity }}, 
              { new: true,upsert: true })
              return ({status: "success", payload: addProduct})
              
            /* const cart = await cartModel.findById(cid).then(async cart =>{
              const existProduct = cart.products.find(item => item.id === pid)
              console.log(existProduct);
              existProduct? existProduct.quantity += quantity : cart.products.push({_id:pid,quantity})
              console.log(existProduct);
              console.log(await cart.save())
              return ({status: "success", payload: cart})
            }) */
            
            
          } catch (error) {
            console.log(error);
          }
        }
        }

        // pruebas

       /*  const cartManager = new CartManager()

        const test = async () =>{
            //await cartManager.addCart()
            //await cartManager.addProductToCart("f7e57d21-c101-487f-b7f1-4473c9b148aa",2,"bfabfa40-8976-4d37-a737-1cb028e99163")
            const products = await cartManager.getProductsByCartId("f7e57d21-c101-487f-b7f1-4473c9b148aa")
            console.log(products)  
        }
        
        test()  */