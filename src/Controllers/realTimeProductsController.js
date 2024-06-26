import { realTimeProductsService } from "../service/service.js";

class realTimeProductController {
    constructor() {
        this.realTimeProductsService = realTimeProductsService
    }
    getRealTimeProducts = async (req = {}, res) => {
        const  limit  = req.query?.limit;
        const products = await realTimeProductsService.getProducts();
    
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            if (res) return res.status(200).send({ status: 'success', payload: limitedProducts });
            return limitedProducts;
        }
        if (res) return res.status(200).send({ status: 'success', payload: products });
        return products;
    }

    createRealTimeProduct = async (req, res) => {
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        const products = await realTimeProductsService.getProducts();
    
        if (!title || !description || !code || !price || !stock || !category)
            return res.status(400).send({ status: 'error', error: 'Faltan campos' });
    
        if (products.find((prod) => prod.code === code))
            return res.status(400).send({ status: 'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código` });
    
        const newProduct = await realTimeProductsService.addProduct(title, description, code, price, status, stock, category, thumbnails);
        res.status(201).send({status:'success', payload:newProduct});
    }
     
}

export default realTimeProductController