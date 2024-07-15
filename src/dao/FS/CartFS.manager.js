import fs from 'fs';
import __dirname from '../util/filenameUtils.js';

const path = `${__dirname}/Carts.json`;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    readCartsJson = async () => {
        try {
            const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(cartsJson);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            return [];
        }
    }

    writeCart = async (cartsData) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'), 'utf-8');
        } catch (error) {
            console.error('Error al escribir en el archivo:', error);
        }
    }

    addNewCart = async () => {
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
            console.error('Error al agregar nuevo carrito:', error);
            throw error;
        }
    }

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
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    getCartById = async (cartId) => {
        try {
            const cartsData = await this.readCartsJson();
            const cart = cartsData.find(cart => cart.id === cartId);

            if (cart) return cart;
            throw new Error(`No existe el carrito con el id ${cartId}`);

        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }

    getNextId = async () => {
        const cartsData = await this.readCartsJson();
        if (cartsData.length === 0) {
            return 1;
        }
        return cartsData[cartsData.length - 1].id + 1;
    }
}

export default CartManager;
