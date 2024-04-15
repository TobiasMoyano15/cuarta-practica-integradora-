import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAllCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error reading carts file');
        }
    }

    async getCartById(cartId) {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            const carts = JSON.parse(data);
            return carts.find(cart => cart.id === cartId);
        } catch (error) {
            throw new Error('Error reading carts file');
        }
    }

    async createCart() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            let carts = JSON.parse(data);
            const newCart = { id: uuidv4(), products: [] };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart');
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            let carts = JSON.parse(data);
            const index = carts.findIndex(cart => cart.id === cartId);
            if (index === -1) {
                throw new Error('Cart not found');
            }
            const existingProductIndex = carts[index].products.findIndex(item => item.product === productId);
            if (existingProductIndex !== -1) {
                // Product already exists in the cart, increase quantity
                carts[index].products[existingProductIndex].quantity += quantity;
            } else {
                // Product doesn't exist in the cart, add it
                carts[index].products.push({ product: productId, quantity });
            }
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return carts[index];
        } catch (error) {
            throw new Error('Error adding product to cart');
        }
    }
}