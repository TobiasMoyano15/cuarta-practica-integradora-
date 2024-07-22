import express from "express";
import handlebars from "express-handlebars";
import { productsSocket } from './util/productsSocket.js';
import { Server as ServerIO } from "socket.io";
import { Server as serverHttp } from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./Config/configpassport.js";
import { connectMongoDb, objectConfig } from "./Config/db.js";
import routerApp from './routes/Routes.js';
import dotenv from 'dotenv';
import __dirname from "./util/filenameUtils.js";
import { chatSocketIO } from "./util/chatSocketIO.js";
import { realTimeProducts } from "./util/realTimeProductsSocketIO.js";
import { handleErrors } from "./middlewares/errors/errors.middleware.js";
import { addLogger, logger } from "./util/logger.js";

dotenv.config();

const app = express();
const httpServer = new serverHttp(app);
const io = new ServerIO(httpServer);
const { port } = objectConfig;

connectMongoDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(productsSocket(io));
initializePassport();
app.use(passport.initialize());
app.use(addLogger)

app.engine(".hbs", handlebars.engine({
    extname: '.hbs'
}));
app.set("views", `${__dirname}/views`);
app.set("view engine", ".handlebars");

app.use(routerApp);
app.use(handleErrors)

httpServer.listen(port, (error) => {
    if (error) return logger.error(error);
    logger.info(`Server escuchando en el puerto ${port}`);
});

realTimeProducts(io);
chatSocketIO(io);