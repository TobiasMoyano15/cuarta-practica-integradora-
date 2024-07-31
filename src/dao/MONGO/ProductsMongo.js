import ProductsModel from './models/product.model.js';

class ProductsMongo {
    constructor() {
        this.productsModel = productsModel;
    }

    create = async (title, description, code, price, status, stock, category, thumbnails = './images/IMG_placeholder.jpg', owner = 'admin') => {
        const newProduct = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
            owner: owner
        };
        const result = await this.productsModel.create(newProduct);
        return result; 
    };

    getAll = async ({ limit = 10, pageNum = 1, sortByPrice, category, status, title } = {}) => {
        let query = {};
        if (category) {
            query.category = category;
        }
        if (status) {
            query.status = status;
        }
        if (title) {
            query.$text = { $search: title, $diacriticSensitive: false };
        }

        let toSortedByPrice = {};
        if (sortByPrice) {
            toSortedByPrice = { price: parseInt(sortByPrice) };
        }

        return await this.productsModel.paginate(query, { limit: limit, page: pageNum, lean: true, sort: toSortedByPrice });
    };

    getBy = async (filter) => {
        return await this.productsModel.findOne(filter).lean();
    };

    update = async (productId, updatedProduct) => {
        if (updatedProduct.stock) {
            return await this.productsModel.findOneAndUpdate(
                { _id: productId },
                { $inc: { stock: updatedProduct.stock } },
                { upsert: true }
            );
        }
        return await this.productsModel.findOneAndUpdate(
            { _id: productId },
            { $set: updatedProduct },
            { upsert: true }
        );
    };

    remove = async (productId) => {
        return await this.productsModel.deleteOne({ _id: productId });
    };
}

export default ProductsMongo;