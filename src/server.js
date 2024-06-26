import express from "express";
import handlebars from "express-handlebars";
import { Server as ServerIO } from "socket.io";
import { Server as serverHttp } from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectMongoDb, objectConfig } from "../config/config.js";
import { productsSocket } from "../utils/productsSocket.js";
import { chatSocketIO } from "../utils/chatSocketIO.js";
import { realTimeProducts } from "../utils/realTimeProductsSocketIO.js";
import { initializePassport } from "../config/passport.config.js";
import MongoStore from "connect-mongo";

import ProductsMongoManager from "../dao/ProductsMongo.js";
import ChatMongoManager from "../dao/ChatMongo.manager.js";
import UsersMongo from '../dao/UsersMongo.js';
import { sessionsRouter } from "../routes/Sessions.router.js";
import viewsRouter from "../routes/ViewRouter.js";
import productsRouter from "../routes/ProductRouter.js";
import cartsRouter from "../routes/CartRouter.js";
import realtimeproductsRouter from "../routes/Realtimeproducts.router.js";
import chatRouter from "../routes/ChatRouter.js";
import pruebasRouter from "../routes/Pruebas.router.js";

const app = express();
const httpServer = new serverHttp(app);
const io = new ServerIO(httpServer);
const { port } = objectConfig;

const userService = new UsersMongo();
const productManager = new ProductsMongoManager();
const chatMongoManager = new ChatMongoManager();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://zieglering:bX5FNTpfWgkHOvE0@cluster0.vxpuio.mongodb.net/ecommerce",
        mongoOptions: {},
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 'F1rmas3cr3t@',
    resave: true,
    saveUninitialized: true
}));

connectMongoDb();
initializePassport();
app.use(passport.initialize());

// View engine setup
app.engine(".hbs", handlebars({
    extname: '.hbs'
}));
app.set("views", "./views");
app.set("view engine", ".hbs");

// Routes
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realtimeproductsRouter);
app.use("/chat", chatRouter);
app.use("/pruebas", pruebasRouter);

// Socket.io setup
io.on("connection", async (socket) => {
    console.log('Cliente conectado');

    // Products Socket
    socket.on("getProducts", async () => {
        const products = await productManager.getProducts();
        socket.emit("getProducts", products);
    });

    socket.on("addProduct", async (newProductData) => {
        try {
            await productManager.addProduct(newProductData);
            const products = await productManager.getProducts();
            io.emit("getProducts", products);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    });

    socket.on("updateProduct", async (productId, updatedProduct) => {
        try {
            await productManager.updateProduct(productId, updatedProduct);
            const products = await productManager.getProducts();
            io.emit("getProducts", products);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit("getProducts", products);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    });

    // Chat Socket
    socket.on("getMessages", async () => {
        const messages = await chatMongoManager.getMessages();
        socket.emit("messageLog", messages);
    });

    socket.on("sendMessage", async (data) => {
        try {
            await chatMongoManager.addMessage(data.user, data.message);
            const messages = await chatMongoManager.getMessages();
            io.emit("messageLog", messages);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});

// Server listen
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
