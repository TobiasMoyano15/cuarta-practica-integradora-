import { Router } from "express";
//import ProductManager from '../dao/MongoDB.ProductManager.js'
import MDBProductManager from "../dao/MongoDB.ProductManager.js";
import { messageModel } from "../dao/models/message.model.js";
const router = new Router()
const productManager = new MDBProductManager();

router.get('/', async (req,res)=>{
    const products = await productManager.getProducts()
    res.render('home', {
        title: 'Productos',
        products,
        styles: 'homeStyles.css'
    })
})

router.get('/realTimeProducts', async (req,res)=>{
    const products = await productManager.getProducts()
    //const categories = [{categoryName: "categoria1"},{categoryName: "categoria2"},{categoryName: "categoria3"}]
    const subCategories = [{subCategoryName: "sub-categoria1"},{subCategoryName: "sub-categoria1"},{subCategoryName: "sub-categoria1"}]
    const brands = [{brandName: "Marca1"},{brandName: "Marca2"},{brandName: "Marca3"}]
    const categories = await productManager.getCategories()
    res.render('realTimeProducts', {
        title: 'Productos en tiempo real',
        products : products,
        styles: 'homeStyles.css',
        categories,
        subCategories
    })
})

router.get('/chat', async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: 'Chat:',
        messages,
        styles: 'homeStyles.css'
    })
   
    const {io} = req
    
    
})


export default router