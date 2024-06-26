import CartModel from './models/cartmodel.js';

class CartsMongoManager {
    constructor() {
        this.cartmodel = CartModel;
    }

    addNewCart = async () => {
        const cart = {
            products: []
        };
        const createdCart = await this.cartmodel.create(cart);
        return createdCart;
    };

    addProductToCart = async (cartId, product, quantity) => {
        const cartExists = this.cartmodel.where({ _id: cartId, 'products.product': product });
        const productExists = await cartExists.find();

        if (productExists.length === 0) {
            const addNewProduct = await this.cartmodel.findOneAndUpdate(
                { _id: cartId },
                { $addToSet: { products: { product: product, quantity: quantity } } },
                { new: true, upsert: true }
            );
            return { status: 'success', payload: addNewProduct };
        } else {
            const incrementQuantity = await this.cartmodel.findOneAndUpdate(
                { _id: cartId, 'products.product': product },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            );
            return { status: 'success', payload: incrementQuantity };
        }
    };

    getCartBy = async (filter) => {
        const cart = await this.cartmodel.findOne(filter).lean();
        return cart;
    };

    updateProductFromCart = async (cartId, product, quantity) => {
        const cartExists = this.cartmodel.where({ _id: cartId, 'products.product': product });
        const productExists = await cartExists.find();

        if (productExists.length === 0) {
            return { status: 'error', payload: `El producto no existe en el carrito ${cartId}` };
        } else {
            const updatedProduct = await this.cartmodel.findOneAndUpdate(
                { _id: cartId, 'products.product': product },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            );
            return { status: 'success', payload: updatedProduct };
        }
    };

    updateCart = async (cid, pid) => {
        const result = await this.cartmodel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $inc: { 'products.$.quantity': 1 } },
            { new: true }
        );
        if (result) return result;

        const newProductInCart = await this.cartmodel.findOneAndUpdate(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } },
            { new: true }
        );
        return newProductInCart;
    };

    deleteProductFromCart = async (cid, pid) => {
        const result = await this.cartmodel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { product: pid } } },
            { new: true }
        );
        return result;
    };

    deleteCart = async (cid) => {
        const result = await this.cartmodel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: [] } },
            { new: true }
        );
        return result;
    };
}

export default CartsMongoManager;
