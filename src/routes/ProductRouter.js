import {Router} from "express";
import { json } from "express";
import ProductManager from "../ProductManager";


const productRouter = Router();
const productos=new ProductManager();


productRouter.use(json());


productRouter.get("/", async (req, res) => {

    try {
        const prods = await productos.getProducts();
        const { limit } = req.query;
        if (limit) {
        return res.send(prods.slice(0, limit));
        } else{
        res.send(prods);
        } 
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }
    
});

productRouter.get("/:pid", async (req, res)=>{
    try {
        const idp = req.params;
        const prods = await productos.getProductsById(idp);
        if (prods) {
        return res.send(prods);
        } else {
        res.send(`El producto con codigo ${idp.pid} no existe`);
        }
    } catch (error) {
        res.status(404).send({error: `${error}`});
    }
    
});


productRouter.post("/", async (req,res)=>{
    
    try {
        const {title,description,code,price,status,stock,category,thumbnail,} = req.body;
        const result = await productos.addProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
        ); 
            
        res.send(result);
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }

    
});

productRouter.put("/:pid", (req,res)=>{
        const idp = req.params;
        const updateData = req.body;
    try {
        
        if (!idp || !updateData) {
        
        return res.status(400).send({ error: "Bad Request for Put" });
        } else {
        productos.updateProduct(idp, updateData);
        res.send(`Producto codigo ${idp.pid} actualizado`);
        }
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }
    
    

});

productRouter.delete("/:pid", async (req,res)=>{
    try {
        const idp = req.params;
        const result= await productos.deleteProduct(idp);
        res.send(result);
        
    } catch (error) {
        res.status(404).send({ error: `${error}` });
    }

});

export default productRouter;