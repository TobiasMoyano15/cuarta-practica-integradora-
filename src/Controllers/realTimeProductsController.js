import { realTimeProductsService } from "../Service/service.js";

class RealTimeProductController {
    constructor() {
        this.realTimeProductsService = realTimeProductsService;
    }

    getRealTimeProducts = async (req = {}, res) => {
        try {
            const limit = req.query?.limit;
            const products = await this.realTimeProductsService.getProducts();

            if (limit) {
                const limitedProducts = products.slice(0, parseInt(limit));
                if (res) return res.status(200).send({ status: 'success', payload: limitedProducts });
                return limitedProducts;
            }
            if (res) return res.status(200).send({ status: 'success', payload: products });
            return products;
        } catch (error) {
            if (res) return res.status(500).send({ status: 'error', error: error });
            throw error;
        }
    }

    createRealTimeProduct = async (req, res) => {
        try {
            const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
            const products = await this.realTimeProductsService.getProducts();

            if (!title || !description || !code || !price || !stock || !category)
                return res.status(400).send({ status: 'error', error: 'Faltan campos' });

            if (products.find((prod) => prod.code === code))
                return res.status(400).send({ status: 'error', error: `No se pudo agregar el producto con el código ${code} porque ya existe un producto con ese código` });

            const newProduct = await this.realTimeProductsService.addProduct({ title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    getRealTimeProductById = async (req, res) => {
        const { pid } = req.params;
        try {
            const productFound = await this.realTimeProductsService.getBy({ _id: pid });
            if (!productFound)
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });

            res.status(200).send({ status: 'success', payload: productFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    updateRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
        try {
            if (!title || !description || !code || !price || !stock || !category)
                return res.status(400).send({ status: 'error', error: 'Faltan campos' });

            const productFound = await this.realTimeProductsService.getBy({ _id: pid });
            if (!productFound)
                return res.status(400).send({ status: 'error', error: `No existe el producto con el id ${pid}` });

            const updatedProduct = await this.realTimeProductsService.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
            res.status(201).send({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }

    removeRealTimeProduct = async (req, res) => {
        const { pid } = req.params;
        try {
            const productFound = await this.realTimeProductsService.getBy({ _id: pid });
            if (!productFound)
                return res.status(400).send({ status: 'error', error: `¡ERROR! No existe ningún producto con el id ${pid}` });

            await this.realTimeProductsService.removeProduct(pid);
            res.status(200).send({ status: 'success', payload: `El producto con el id ${pid} ha sido eliminado` });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error });
        }
    }
}

export default RealTimeProductController;
