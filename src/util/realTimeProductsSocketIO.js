import RealTimeProductController from "../Controllers/realTimeProductsController.js";


const {
    getRealTimeProducts,
    createRealTimeProduct
} = new RealTimeProductController();

// socket.io config para el endpoint de realtimeproducts
export const realTimeProducts = (io) => {
    io.on("connection", async (socket) => {
        console.log('Cliente conectado');
        const products = await getRealTimeProducts();

        socket.emit("getProducts", products.docs);

        socket.on("createProduct", async (newProductData) => {
            try {
                const responseData = await createRealTimeProduct(
                    newProductData.title,
                    newProductData.description,
                    newProductData.code,
                    newProductData.price,
                    newProductData.status,
                    newProductData.stock,
                    newProductData.category,
                    newProductData.thumbnails
                );
                io.emit("getProducts", await getRealTimeProducts());
                return responseData;
            } catch (error) {
                console.error("Error", error);
            }
        });

        socket.on("updateProduct", async (productID, updatedProduct) => {
            try {

                await productService.update(parseInt(productID), updatedProduct);
                io.emit("getProducts", await getRealTimeProducts());

            } catch (error) {
                console.error("Error", error);
            }
        });

        socket.on("deleteProduct", async (productID) => {
            try {
                await productService.remove(parseInt(await productID));
                io.emit("getProducts", await getRealTimeProducts());

            } catch (error) {
                console.error("Error", error);

            }
        });

    });

};