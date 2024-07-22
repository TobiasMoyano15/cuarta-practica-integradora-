export default class RealTimeProductsRepository {
    constructor(RealtimeProductsDao) {
        this.RealtimeProductsDao = RealtimeProductsDao;
    }

    getProducts = async () => await this.RealtimeProductsDao.getAll();
    getProduct = async filter => await this.RealtimeProductsDao.getBy(filter);
    createProduct = async newProduct => await this.RealtimeProductsDao.create(newProduct);
    updateProduct = async (pid, productToUpdate) => await this.RealtimeProductsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.RealtimeProductsDao.remove(pid);
}