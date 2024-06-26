// CRUD en Archivos (Files System)
import fs from 'node:fs';
import { __dirname } from '../filenameUtils.js';

const path = `${__dirname}/FS-Database/Products.json`;

class ProductFSManager {
    constructor(path) {
        this.path = path;
    }

    readProductsJson = async () => {
        try {
            const productsJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(productsJson);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            return [];
        }
    }

    writeProduct = async (productsData) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(productsData, null, '\t'), 'utf-8');
        } catch (error) {
            console.error('Error al escribir en el archivo:', error);
        }
    }

    getProducts = async () => {
        return await this.readProductsJson();
    }

    addProduct = async (title, description, code, price, status, stock, category, thumbnails = './images/IMG_placeholder.jpg') => {
        try {
            const product = {
                id: await this.getNextId(),
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            };

            const productsData = await this.readProductsJson();

            const codeExistsCheck = productsData.find((prod) => prod.code === code);

            const completeProductCheck = [];
            for (const prop in product) {
                if (!product[prop]) {
                    completeProductCheck.push(prop);
                }
            }

            if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
                if (completeProductCheck.length > 1) {
                    throw new Error(`¡ERROR! debe llenar todos los campos del producto nuevo\nFaltaron agregar ${completeProductCheck.join(', ')}`);
                }
                throw new Error(`¡ERROR! debe llenar todos los campos del producto nuevo\nFaltó agregar ${completeProductCheck.join(', ')}`);
            }

            if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string' || typeof thumbnails !== 'string') {
                throw new Error("title, description, thumbnails, y code deben ser string");
            }

            if (typeof price !== 'number' || typeof stock !== 'number') {
                throw new Error("price y stock deben ser números");
            }

            if (typeof status !== 'boolean') {
                throw new Error("status debe ser booleano");
            }

            if (codeExistsCheck) {
                throw new Error(`¡ERROR! Producto ${product.title} no agregado\nEl código ${product.code} ya está siendo utilizado por el producto ${codeExistsCheck.title}, con el id ${codeExistsCheck.id}`);
            }

            productsData.push(product);
            await this.writeProduct(productsData);
            return productsData;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    getProductsById = async (productId) => {
        try {
            const productsData = await this.readProductsJson();
            const idCheck = productsData.find((prod) => prod.id === productId);
            return idCheck;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    updateProduct = async (productId, updatedProduct) => {
        try {
            const productsData = await this.readProductsJson();
            const productIndex = productsData.findIndex(product => product.id === productId);

            if (productIndex === -1) {
                throw new Error(`El Producto con el id: ${productId} no existe`);
            }

            const newUpdatedProduct = {
                ...productsData[productIndex],
                ...updatedProduct
            };

            productsData[productIndex] = newUpdatedProduct;

            await this.writeProduct(productsData);
            return productsData;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    deleteProduct = async (productId) => {
        try {
            const productsData = await this.readProductsJson();
            const productToDeleteIndex = productsData.findIndex(product => product.id === productId);
            
            if (productToDeleteIndex === -1) {
                return `No existe el producto con id: ${productId}`;
            }

            console.log(`El producto ${productsData[productToDeleteIndex].title} con el id ${productId} fue eliminado`);
            productsData.splice(productToDeleteIndex, 1);
            await this.writeProduct(productsData);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    getNextId = async () => {
        const productsData = await this.readProductsJson();
        if (productsData.length === 0) {
            return 1;
        }
        return productsData[productsData.length - 1].id + 1;
    }
}

export default ProductFSManager;
