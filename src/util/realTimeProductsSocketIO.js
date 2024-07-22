import RealTimeProductController from "../Controllers/realTimeProductsController.js";
import { logger } from "./logger.js";

// falta implementar createRealTimeProduct

const {
    getRealTimeProducts,
    createRealTimeProduct
} = new RealTimeProductController();

export const realTimeProducts = (io) => {
    io.on("connection", async (socket) => {
        logger.info('Cliente conectado');
        const products = await getRealTimeProducts();

        socket.emit("getProducts", products);

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
                logger.error("Error", error);
            }
        });

        socket.on("updateProduct", async (productID, updatedProduct) => {
            try {

                await productService.update(parseInt(productID), updatedProduct);
                io.emit("getProducts", await getRealTimeProducts());

            } catch (error) {
                logger.error("Error", error);
            }
        });

        socket.on("deleteProduct", async (productID) => {
            try {
                await productService.remove(parseInt(await productID));
                io.emit("getProducts", await getRealTimeProducts());

            } catch (error) {
                logger.error("Error", error);
            }
        });
    });
};