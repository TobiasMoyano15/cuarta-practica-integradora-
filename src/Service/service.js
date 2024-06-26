import UsersManagerMongo from "../dao/UsersMongo.js";
import ProductsMongoManager from "../dao/ProductsMongo.js";
import CartsMongoManager from "../dao/CartMongo.manager.jss";
import ChatMongoManager from "../dao/ChatMongo.manager.js";

export const userService = new UsersManagerMongo();
export const productService = new ProductsMongoManager();
export const cartService = new CartsMongoManager();
export const chatService = new ChatMongoManager();
export const realTimeProductsService = new ProductsMongoManager();