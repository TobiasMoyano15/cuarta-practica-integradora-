import express from "express";
import handlebars from "express-handlebars";
import { productsSocket } from './util/productsSocket.js';
import { Server as ServerIO } from "socket.io";
import { Server as serverHttp } from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./Config/configpassport.js";
import { connectMongoDb, objectConfig } from "./Config/db.js";
import dotenv from 'dotenv';

import __dirname from "./util/filenameUtils.js";
import { chatSocketIO } from "./util/chatSocketIO.js";
import { realTimeProducts } from "./util/realTimeProductsSocketIO.js";

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

app.engine(".hbs", handlebars.engine({
    extname: '.hbs'
}));
app.set("views", `${__dirname}/views`);
app.set("view engine", ".handlebars");


app.use(routerApp);


httpServer.listen(port, (error) => {
    if (error) return console.log(error);
    console.log(`Server escuchando en el puerto ${port}`);
});



// realTimeProducts(io);
chatSocketIO(io);