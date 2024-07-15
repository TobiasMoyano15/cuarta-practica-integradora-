import { objectConfig } from "../Config/db.js";

export let UsersDao;
export let ProductsDao;
export let CartsDao;
export let TicketsDao;
export let ChatsDao;
export let RealtimeProductsDao;


switch (objectConfig.persistence) {
    case 'MEMORY':
        const { default: ProductsDaoMemory } = await import('./MEMORY/ProductsDaoMemory.js');

        ProductsDao = ProductsDaoMemory;
        break;

    case 'FS':
        const { default: UsersDaoFS } = await import('./FS/UsersFS.js');
        const { default: ProductsDaoFS } = await import('./FS/ProductsFS.manager.js');
        const { default: CartsDaoFS } = await import('./FS/CartFS.manager.js');

        UsersDao = UsersDaoFS;
        ProductsDao = ProductsDaoFS;
        CartsDao = CartsDaoFS;
        break;

    default:
        const { default: UsersDaoMongo } = await import('./MONGO/UsersMongo.js');
        const { default: ProductsDaoMongo } = await import('./MONGO/ProductsMongo.js');
        const { default: CartsDaoMongo } = await import('./MONGO/CartMongo.manager.js');
        const { default: TicketsDaoMongo } = await import('./MONGO/TicketsMongo.js');
        const { default: ChatsDaoMongo } = await import('./MONGO/ChatMongo.manager.js');
        const { default: RealtimeProductsDaoFS } = await import('./FS/realTimeProductsFS.js');


        UsersDao = UsersDaoMongo;
        ProductsDao = ProductsDaoMongo;
        CartsDao = CartsDaoMongo;
        TicketsDao = TicketsDaoMongo;
        ChatsDao = ChatsDaoMongo;
        RealtimeProductsDao = RealtimeProductsDaoFS;
        break;
}