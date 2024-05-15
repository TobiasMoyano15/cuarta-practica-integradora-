import express from "express";
import { __dirname } from "./FileNameUtil.js";
import productsRouter from "./routes/ProductRouter.js";
import realtimeproductsRouter from "./routes/Realtimeproducts.router.js";
import cartsRouter from "./routes/CartRouter.js";
import chatRouter from "./routes/ChatRouter.js"
import viewsRouter from "./routes/ViewRouter.js";
import handlebars from "express-handlebars";
import { productsSocket } from './util/productsSocket.js'
import { Server } from "socket.io";
import ProductManager from "./dao/ProductsFS.manager.js";
import connectMongoDB from './Config/db.js'
import ChatMongoManager from "./dao/ChatMongo.manager.js";



const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const productManager = new ProductManager(productsJsonPath);
const chatMongoManager = new ChatMongoManager

const app = express();
const PORT = process.env.PORT || 8080 || 80 || '179.27.75.242';

const httpServer = app.listen(PORT, (error) => {
    if (error) return console.log(error);
    console.log(`Server escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

connectMongoDB()


app.engine(".hbs", handlebars.engine({
    extname: '.hbs'
}));

app.set("views", `${__dirname}/views`);
app.set("view engine", ".handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/realtimeproducts", realtimeproductsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);

app.use(productsSocket(io))

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})



io.on("connection", async (socket) => {
    console.log('Cliente conectado');

    socket.emit("getProducts", await productManager.getProducts());

    socket.on("addProduct", async (newProductData) => {
        try {
            const responseData = await productManager.addProduct(
                newProductData.title,
                newProductData.description,
                newProductData.code,
                newProductData.price,
                newProductData.status,
                newProductData.stock,
                newProductData.category,
                newProductData.thumbnails
            );
            io.emit("getProducts", await productManager.getProducts());
        } catch (error) {
            console.error("Error", error);
        }
    });

    socket.on("updateProduct", async (productID, updatedProduct) => {
        try {

            await productManager.updateProduct(parseInt(productID), updatedProduct)
            io.emit("getProducts", await productManager.getProducts());

        } catch (error) {
            console.error("Error", error);

        }
    })

    socket.on("deleteProduct", async (productID) => {
        try {
            await productManager.deleteProduct(parseInt(await productID))
            io.emit("getProducts", await productManager.getProducts());

        } catch (error) {
            console.error("Error", error);

        }
    })

    // Chat socket
    let messages = []

    try {
        messages = await chatMongoManager.getMessages();
        socket.emit('messageLog', messages);
    } catch (error) {
        throw error
    }

    socket.on('message', async data => {
        console.log('message data: ', data)

        try {
            await chatMongoManager.addMessage(data.user, data.message);
            messages = await chatMongoManager.getMessages();
            io.emit('messageLog', messages);
        } catch (error) {
            throw error
        }

    })
})