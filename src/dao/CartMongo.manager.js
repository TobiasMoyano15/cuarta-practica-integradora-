import cartsModel from "./models/cartmodel";

class CartsMongoManager {
    constructor() {
        this.cartsModel = cartsModel;
    }

    addNewCart = async () => {
        const cart = {
            products: []
        };
        const createdCart = await this.cartsModel.create(cart);
        return createdCart;
    }

    addProductToCart = async (cartId, product, quantity) => {
        try {

            const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': product })
            const productExists = await cartExists.find()


            if (productExists.length === 0) {
                const addNewProduct = await this.cartsModel.findOneAndUpdate(
                    { _id: cartId },
                    { $addToSet: { products: { product: product, quantity: quantity } } },
                    { new: true, upsert: true }
                );
                return { status: 'success', payload: addNewProduct };

            } else {
                const incrementQuantity = await this.cartsModel.findOneAndUpdate(
                    { _id: cartId, 'products.product': product },
                    { $inc: { 'products.$.quantity': quantity } },
                    { new: true }

                );
                return { status: 'success', payload: incrementQuantity };
            }
        } catch (error) {
            return error;
        }
    };

    getCartById = async (cartId) => {
        try {
            return await this.cartsModel.findOne({ _id: cartId }).lean();


        } catch (error) {
            return error;
        }
    };
    updateProductFromCart = async (cartId, product, quantity) => {
        try {
            const cartExists = this.cartsModel.where({ _id: cartId, 'products.product': product })
            const productExists = await cartExists.find()


            if (productExists.length === 0) {
                return { status: 'success', payload: `El producto no existe en el carrito ${cartId}` };
            }
            else {
                const updatedProduct = await this.cartsModel.findOneAndUpdate(
                    { _id: cartId, 'products.product': product },
                    { $set: { 'products.$.quantity': quantity } },
                    { new: true }
                )
                return { status: 'success', payload: updatedProduct };
            }


        } catch (error) {
            
        }
    }

    updateCart = async (cartId, products) => {
        try {
            const updatedCart = await this.cartsModel.findOneAndUpdate(
                { _id: cartId },
                { $push: { products: {$each: products} } },
                { new: true, upsert: true }
            );
            return { status: 'success', payload: updatedCart };
        } catch (error) {
            return {status:'error', error: 'Error al agregar productos al carrito'}

        }
    }

    deleteProductFromCart = async (cartId, product) => {
        try {
            const cartExists = await this.cartsModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { product: product } } },
                { new: true }
            );

            if (!cartExists) {
                return { status: 'error', error: `El carrito ${cartId} no existe` };
            }

            return { status: 'success', payload: `El producto ${product} fue eliminado del carrito ${cartId}` };
        } catch (error) {
            console.error('Error al borrar el producto del carrito:', error);
            return { status: 'error', error: 'Error al eliminar el producto del carrito' };
        }
    }


    deleteCart = async (cartId, product) => {
        try {
            await this.cartsModel.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true }
            )
            return { status: 'success', payload: `El carrito fue eliminado correctamente` };


        } catch (error) {
            console.log(error)

        }
    }
}


export default CartsMongoManager;