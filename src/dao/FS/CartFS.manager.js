import fs from 'fs';
import { __dirname } from '../util/filenameUtils.js';
import { logger } from '../util/logger.js';

const path = `${__dirname}/Carts.json`;

class CartsDaoFS {
    constructor(path) {
        this.path = path;
    }

    readCartsJson = async () => {
        try {
            const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(cartsJson);
        } catch (error) {
            logger.error(error);
            return [];
        }
    };

    writeCart = async (cartsData) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'), 'utf-8');
        } catch (error) {
            logger.error(error);
        }
    };

    create = async () => {
        try {
            const cart = {
                id: await this.getNextId(),
                products: []
            };
            const cartsData = await this.readCartsJson();
            cartsData.push(cart);
            await this.writeCart(cartsData);
            return cart;
        } catch (error) {
            logger.error('Error al crear nuevo carrito:', error);
            throw error;
        }
    };

    addProductToCart = async (cartId, product, quantity) => {
        try {
            const cartsData = await this.readCartsJson();
            const cartIndex = cartsData.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                throw new Error(`No existe el carrito con el id ${cartId}`);
            }

            const cart = cartsData[cartIndex];
            const existingProductIndex = cart.products.findIndex(prod => prod.product === product);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }

            await this.writeCart(cartsData);
            return cart;

        } catch (error) {
            logger.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    };

    getBy = async (filter) => {
        try {
            const cartsData = await this.readCartsJson();
            const foundCart = cartsData.find(cart => cart.id === filter);

            if (foundCart) return foundCart;
            throw new Error(`No existe el carrito con el id ${filter}`);
        } catch (error) {
            logger.error('Error al obtener el carrito:', error);
            throw error;
        }
    };

    getNextId = async () => {
        const cartsData = await this.readCartsJson();
        if (cartsData.length === 0) {
            return 1;
        }
        return cartsData[cartsData.length - 1].id + 1;
    };
}

export default CartFS;
