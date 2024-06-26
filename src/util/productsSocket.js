import realTimeProductController from "../Controllers/realTimeProductsController";
// falta implementar createRealTimeProduct

const {
    getRealTimeProducts,
    createRealTimeProduct
} = new realTimeProductController();

// socket.io config para el endpoint de realtimeproducts
export const realTimeProducts = (io) => {
    io.on("connection", async (socket) => {
        console.log('Cliente conectado');
        const products = await getRealTimeProducts();

        socket.emit("getProducts", products.docs);

        socket.on("addProduct", async (newProductData) => {
            try {
                const responseData = await productService.addProduct(
                    newProductData.title,
                    newProductData.description,
                    newProductData.code,
                    newProductData.price,
                    newProductData.status,
                    newProductData.stock,
                    newProductData.category,
                    newProductData.thumbnails
                );
                io.emit("getProducts", await productService.getProducts());
                return responseData;
            } catch (error) {
                console.error("Error", error);
            }
        });

        socket.on("updateProduct", async (productID, updatedProduct) => {
            try {

                await productService.updateProduct(parseInt(productID), updatedProduct);
                io.emit("getProducts", await productService.getProducts());

            } catch (error) {
                console.error("Error", error);
            }
        });

        socket.on("deleteProduct", async (productID) => {
            try {
                await productService.deleteProduct(parseInt(await productID));
                io.emit("getProducts", await productService.getProducts());

            } catch (error) {
                console.error("Error", error);

            }
        });

    });

};