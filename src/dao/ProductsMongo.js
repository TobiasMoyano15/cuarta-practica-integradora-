import ProductModel from './models/product.model.js';

class ProductsMongoManager {
    constructor() {
        this.productModel = ProductModel;
    }

    async getProducts({ limit = 10, pageNum = 1, sortByPrice, category, status, title }) {
        let query = {};
        if (category) {
            query.category = category;
        }
        if (status) {
            query.status = status;
        }
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        let toSortedByPrice = {};
        if (sortByPrice) {
            toSortedByPrice = { price: parseInt(sortByPrice) };
        }

        return await this.productModel.paginate(query, { limit: limit, page: pageNum, lean: true, sort: toSortedByPrice });
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnails = './images/IMG_placeholder.jpg') {
        const newProduct = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        };
        try {
            return await this.productModel.create(newProduct);
        } catch (error) {
            throw error;
        }
    }

    async getProductsById(productId) {
        return await this.productModel.findOne({ _id: productId }).lean();
    }

    async updateProduct(productId, updatedProduct) {
        return await this.productModel.updateOne({ _id: productId }, { $set: updatedProduct });
    }

    async deleteProduct(productId) {
        return await this.productModel.deleteOne({ _id: productId });
    }
}

export default ProductsMongoManager;
