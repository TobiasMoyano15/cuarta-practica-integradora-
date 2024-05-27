
import cartsModel from "./models/carts.model.js";

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
    //PROFE
    // usando un filtro podemos buscar por diferentes propiedades filter = {_id: cid} o {email: userEmail}
    getCartBy = async (filter) => await this.cartsModel.findOne(filter).lean()

    //MIO
    // getCartById = async (cartId) => {
    //     try {
    //         return await this.cartsModel.findOne({ _id: cartId }).lean();


    //     } catch (error) {
    //         return error;
    //     }
    // };
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
    //PROFE
    updateCart = async (cid, pid) => {
        // Si existe el producto pid lo incrementa en 1
        const result = await cartsModel.findOneAndUpdate(
            { _id: cid, 'prodcuts.product': pid },// busque por _id el cid
            { $inc: { 'products.$.quantity': 1 } }, // incrementa la quantity en 1
            { new: true } // new en true para que nos devuelva a lo  ultimo el resultado, y upsert para que si no lo encuentra lo cree
        )
        if (result) return result

        const newProductInCart = await cartsModel.findOneAndUpdate(
            { _ud: cid },
            { $push: { products: { product: pid, quantity: 1 } } },
            { new: true }
        )
        return newProductInCart;


    }

    // MIO  !! NO USAR TRY CATCH EN EL MANAGER, PORQUE LUEGO PASA AL ROUTER Y AHI SE USA TRY CATCH
    // updateCart = async (cartId, products) => {
    //     try {
    //         const updatedCart = await this.cartsModel.findOneAndUpdate(
    //             { _id: cartId },
    //             { $push: { products: {$each: products} } },
    //             { new: true, upsert: true }
    //         );
    //         return { status: 'success', payload: updatedCart };
    //     } catch (error) {
    //         return {status:'error', error: 'Error al agregar productos al carrito'}

    //     }
    // }

    //PROFE
    deleteProduct = async (cid, pid) => await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid, quantity: 1 } } },
        { new: true }
    )


    // MIO
    // deleteProductFromCart = async (cartId, product) => {
    //     try {
    //         const cartExists = await this.cartsModel.findByIdAndUpdate(
    //             cartId,
    //             { $pull: { products: { product: product } } },
    //             { new: true }
    //         );

    //         if (!cartExists) {
    //             return { status: 'error', error: `El carrito ${cartId} no existe` };
    //         }

    //         return { status: 'success', payload: `El producto ${product} fue eliminado del carrito ${cartId}` };
    //     } catch (error) {
    //         console.error('Error al borrar el producto del carrito:', error);
    //         return { status: 'error', error: 'Error al eliminar el producto del carrito' };
    //     }
    // }

    //PROFE
    deleteCart = async (cid) => cartsModel.findOneAndUpdate(
        { _id: cid },
        { $set: { products: [] } },
        { new: true }
    )

    // MIO
    // deleteCart = async (cartId, product) => {
    //     try {
    //         await this.cartsModel.findByIdAndUpdate(
    //             cartId,
    //             { $set: { products: [] } },
    //             { new: true }
    //         )
    //         return { status: 'success', payload: `El carrito fue eliminado correctamente` };


    //     } catch (error) {
    //         console.log(error)

    //     }
    // }
}


export default CartsMongoManager;