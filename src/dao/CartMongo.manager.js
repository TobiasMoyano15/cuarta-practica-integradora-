import cartmodel from '../models/cartmodel.js';

class CartsMongoManager {
    constructor() {
        this.cartmodel = cartmodel;
    }

    addNewCart = async () => {
        const cart = {
            products: []
        };
        const createdCart = await this.cartmodel.create(cart);
        return createdCart;
    }

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

    // Usando un filtro podemos buscar por diferentes propiedades: filter = {_id: cid} o {email: userEmail}
    getCartBy = async (filter) => await this.cartmodel.findOne(filter).lean();

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

    deleteProduct = async (cid, pid) => await this.cartmodel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
    );

    deleteCart = async (cid) => await this.cartmodel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
    );
}

export default CartsMongoManager;
