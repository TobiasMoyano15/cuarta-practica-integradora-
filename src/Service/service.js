import UsersRepository from "../repositories/usersRepository.js";
import ProductsRepository from "../repositories/productsRepository.js";
import CartsRepository from "../repositories/cartsRepository.js";
import TicketsRepository from "../repositories/ticketsRepository.js";
import ChatsRepository from "../repositories/chatsRepository.js";
import RealTimeProductsRepository from "../repositories/realTimeProductsRepository.js";
import { CartsDao, ChatsDao, ProductsDao, RealtimeProductsDao, TicketsDao, UsersDao } from "../daos/factory.js";

export const userService = new UsersRepository(new UsersDao());
export const productService = new ProductsRepository(new ProductsDao());
export const cartService = new CartsRepository(new CartsDao());
export const ticketService = new TicketsRepository(new TicketsDao());
export const chatService = new ChatsRepository(new ChatsDao());
export const realTimeProductsService = new RealTimeProductsRepository(new RealtimeProductsDao())