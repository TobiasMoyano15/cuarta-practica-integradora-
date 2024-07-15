import { Router } from "express";
import viewsRouter from "./ViewRouter.js";
import pruebasRouter from "./Pruebas.router.js";
import realtimeproductsRouter from "./Realtimeproducts.router.js";
import productsRouter from "./ProductRouter.js";
import cartsRouter from "./CartRouter.js";
import usersRouter from "./Users.router.js";
import chatRouter from "./ChatRouter.js";
import { sessionsRouter } from "./Sessions.router.js";


const router = Router()

router.use("/", viewsRouter);
router.use("/Sessions", sessionsRouter);
router.use("/Products", productsRouter);
router.use("/Users", usersRouter);
router.use("/Carts", cartsRouter);
router.use("/Realtimeproducts", realtimeproductsRouter);
router.use("/Chat", chatRouter);
router.use("/Pruebas", pruebasRouter);

export default router