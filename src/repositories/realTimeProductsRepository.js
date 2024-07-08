export default class RealTimeProductsRepository {
    constructor(realTimeProductsDao) {
        this.realTimeProductsDao = realTimeProductsDao;
    }

    getProducts = async (filter) => await this.realTimeProductsDao.getAll(filter);
    getProduct = async filter => await this.realTimeProductsDao.getBy(filter);
    createProduct = async newProduct => await this.realTimeProductsDao.create(newProduct);
    updateProduct = async (pid, productToUpdate) => await this.realTimeProductsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.realTimeProductsDao.remove(pid);
}