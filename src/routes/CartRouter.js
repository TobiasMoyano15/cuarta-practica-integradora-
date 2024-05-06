import { Router } from "express";
//import CartManager from '../dao/FS.CartManager.js'
//import { isExist} from "../utils.js";
import MDBCartManager from "../dao/MongoDB.CartManager.js";
import { __dirname } from "../utils/utils.js";

const router = new Router() 
const cartManager = new MDBCartManager();

router.get('/:cid', async (req,res)=>{
    const {cid} = req.params
    const ProductsByCartId = await cartManager.getProductsByCartId(cid)
    if(!ProductsByCartId){return res.status(404).send({status:'error', error: 'Carrito no encontrado'})}
    res.send({status: 'success', payload: ProductsByCartId})
})

router.post('/', async (req,res)=>{
    await cartManager.addCart()
    res.send({status: 'success', payload: 'Carrito creado satisfactoriamente'})
})

router.post('/:cid/products/:pid', async (req,res)=>{
    const {cid} = req.params
    const {pid} = req.params
    /* const existCart = await isExist(cid,`${__dirname}/carts.json`)
    const existProduct = await isExist(pid,`${__dirname}/products.json`)
    if(!existProduct){
        return res.status(404).send({status: 'error', error:`No existe el producto solicitado`})
        }
    if(!existCart){
        return res.status(404).send({status: 'error', error:`No existe el carrito solicitado`})
        } */
    const{quantity}=req.body
    res.send(await cartManager.addProductToCart(cid,quantity,pid))
    //res.send({status: 'success', payload: 'Productos agregados satisfactoriamente'})
})

export default router