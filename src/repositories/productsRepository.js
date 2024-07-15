export default class ProductsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao;
    }

    getProducts = async (filter) => await this.productsDao.getAll(filter);
    getProduct = async filter => await this.productsDao.getBy(filter);
    createProduct = async newProduct => await this.productsDao.create(newProduct);
    updateProduct = async (pid, productToUpdate) => await this.productsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.productsDao.remove(pid);
}
