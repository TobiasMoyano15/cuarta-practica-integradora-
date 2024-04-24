import { Router } from "express";
import { json } from "express";
import cartManager from "../cartsManager.js";

const cartRouter = Router();
cartRouter.use(json());
const carts = new cartManager;

cartRouter.get("/", async (req, res) => {

const cart = await carts.getCart();
res.send(cart);
});

cartRouter.get("/:cid", async (req, res)=>{

    try {
        const idc = req.query;
        const cart = await carts.getIdCart(idc);
        res.send(cart);
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }
    
});

cartRouter.post("/", async (req,res)=>{

    try {
        const { prod } = req.body;
        const newCart = await carts.addCart();
        res.send(newCart);
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }
    

});

cartRouter.post("/:cid/product/:pid", (req,res)=>{

    try {
        const cartId=req.params.cid;
        const prodId=req.params.pid;
        const result= carts.addProductcart(cartId,prodId);
        res.result(result);
        
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }


});

export default cartRouter;