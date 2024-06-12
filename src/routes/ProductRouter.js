import { Router } from 'express';
import ProductsMongo from '../dao/ProductsMongo.js';

const router = Router();
const productService = new ProductsMongo();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, pageNum = 1, category, status, product: title, sortByPrice } = req.query;
        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productService.getProducts({ limit, pageNum, category, status, title, sortByPrice });

        let prevLink = null;
        let nextLink = null;

        if (hasPrevPage) {
            prevLink = `/products?pageNum=${prevPage}`;
            if (limit) prevLink += `&limit=${limit}`;
            if (title) prevLink += `&product=${title}`;
            if (category) prevLink += `&category=${category}`;
            if (status) prevLink += `&status=${status}`;
            if (sortByPrice) prevLink += `&sortByPrice=${sortByPrice}`;
        }

        if (hasNextPage) {
            nextLink = `/products?pageNum=${nextPage}`;
            if (limit) nextLink += `&limit=${limit}`;
            if (title) nextLink += `&product=${title}`;
            if (category) nextLink += `&category=${category}`;
            if (status) nextLink += `&status=${status}`;
            if (sortByPrice) nextLink += `&sortByPrice=${sortByPrice}`;
        }

        res.status(200).send({
            status: 'success',
            payload: {
                products: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            }
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'No se pudo leer la base de datos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        const products = await productService.getProducts();

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: 'error', error: 'Faltan campos' });
        }

        if (products.find((prod) => prod.code === code)) {
            return res.status(400).send({ status: 'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código` });
        }

        const newProduct = await productService.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).send({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'No se pudo agregar el producto' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productFound = await productService.getProductsById(pid);

        if (!productFound) {
            return res.status(404).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });
        }

        res.status(200).send({ status: 'success', payload: productFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'No se pudo obtener el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        const productFound = await productService.getProductsById(pid);

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ status: 'error', error: 'Faltan campos' });
        }

        if (!productFound) {
            return res.status(404).send({ status: 'error', error: `No existe el producto con el id ${pid}` });
        }

        const updatedProduct = await productService.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
        res.status(200).send({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'No se pudo actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productFound = await productService.getProductsById(pid);

        if (!productFound) {
            return res.status(404).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });
        }

        await productService.deleteProduct(pid);
        res.status(200).send({ status: 'success', payload: productFound });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'No se pudo eliminar el producto' });
    }
});

export default router;
