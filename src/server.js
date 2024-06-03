import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import connectMongoDB from '../config/db.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import { __dirname } from "../filenameUtils.js";
import { productsSocket } from '../src/util/productsSocket.js';
import ProductManager from "../src/dao/ProductsFS.manager.js";
import ChatMongoManager from "../src/dao/ChatMongo.manager.js";
import viewsRouter from "../src/routes/ViewRouter.js";
import pruebasRouter from "../src/routes/Pruebas.router.js";
import realtimeproductsRouter from "../src/routes/Realtimeproducts.router.js";
import productsRouter from "../src/routes/ProductRouter.js";
import cartsRouter from "../src/routes/CartRouter.js";
import chatRouter from "../src/routes/ChatRouter.js";
import { sessionsRouter } from "../src/routes/Sessions.router.js";
import MongoStore from "connect-mongo";


const productsJsonPath = `${__dirname}/FS-Database/Products.json`;
const productManager = new ProductManager(productsJsonPath);
const chatMongoManager = new ChatMongoManager;

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
app.use(cookieParser('F1rmas3cr3t@'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://zieglering:bX5FNTpfWgkHOvE0@cluster0.vxpuioi.mongodb.net/ecommerce',
        mongoOptions: {
        },
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 'F1rmas3cr3t@',
    resave: true,
    saveUninitialized: true
}));

connectMongoDB();


app.engine(".hbs", handlebars.engine({
    extname: '.hbs'
}));

app.set("views", `${__dirname}/views`);
app.set("view engine", ".handlebars");

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realtimeproductsRouter);
app.use("/chat", chatRouter);
app.use("/pruebas", pruebasRouter);

app.use(productsSocket(io));

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server');
});

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

            await productManager.updateProduct(parseInt(productID), updatedProduct);
            io.emit("getProducts", await productManager.getProducts());

        } catch (error) {
            console.error("Error", error);

        }
    });

    socket.on("deleteProduct", async (productID) => {
        try {
            await productManager.deleteProduct(parseInt(await productID));
            io.emit("getProducts", await productManager.getProducts());

        } catch (error) {
            console.error("Error", error);

        }
    });

    // Chat socket
    let messages = [];

    try {
        messages = await chatMongoManager.getMessages();
        socket.emit('messageLog', messages);
    } catch (error) {
        throw error;
    }

    socket.on('message', async data => {
        console.log('message data: ', data);

        try {
            await chatMongoManager.addMessage(data.user, data.message);
            messages = await chatMongoManager.getMessages();
            io.emit('messageLog', messages);
        } catch (error) {
            throw error;
        }

    });
});