import { Router } from 'express';
import { __dirname } from '../FileNameUtil.js';
import ProductManager from '../dao/ProductsFS.manager.js';

const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const router = Router();
const { getProducts, addProduct } = new ProductManager(productsJsonPath);

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.status(200).send({ status: 'success', payload: limitedProducts });
    }

    res.status(200).send({ status: 'success', payload: products });
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const products = await getProducts();

    if (!title || !description || !code || !price || !stock || !category)
        return res.status(400).send({ status: 'error', error: 'Faltan campos' });

    if (products.find((prod) => prod.code === code))
        return res.status(400).send({ status: 'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código` });

    const newProduct = await addProduct(title, description, code, price, status, stock, category, thumbnails);

    res.status(201).send({status:'success', payload:newProduct});
});

export default router;