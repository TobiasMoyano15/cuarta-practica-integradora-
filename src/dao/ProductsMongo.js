import productModel from '../models/productModel.js';



class ProductsMongoManager {
    constructor() {
        this.productsModel = productsModel;
    }

    getProducts = async ({ limit = 10, pageNum = 1, sortByPrice, category, status, title }) => {
        let query = {}
        if (category) {
            query = { category:category };
        }
        if (status) {
            query = { status:status };
        }
        if (title) {
            query = { title: title };
        }
        
        let toSortedByPrice = {}
        if (sortByPrice){
            toSortedByPrice = {price: parseInt(sortByPrice)}
        }
        
        return await this.productsModel.paginate(query, { limit: limit, page: pageNum, lean: true, sort: toSortedByPrice });
    }

    addProduct = async (title, description, code, price, status, stock, category, thumbnails = './images/IMG_placeholder.jpg') => {
        const newProduct = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        }
        try {
            return await this.productsModel.collection.insertOne(newProduct);

        } catch (error) {
            throw error
        }
    }
    getProductsById = async (productId) => {
        return await this.productsModel.findOne({ _id: productId }).lean();
    }
    updateProduct = async (productId, updatedProduct) => {
        return await this.productsModel.updateOne({ _id: productId }, { $set: updatedProduct });
    }
    deleteProduct = async (productId) => {
        return await this.productsModel.deleteOne({ _id: productId });
    }


}

// temporal para insertar mas productos
const productosmuchos = [
    {
        "title": "Remera-01",
        "description": "Remera-01 Descripción",
        "code": "REM001",
        "price": 1500,
        "status": true,
        "stock": 20,
        "category": "remeras",
        "thumbnails": "./images/remera01.jpg"
    },
    {
        "title": "Remera-02",
        "description": "Remera-02 Descripción",
        "code": "REM002",
        "price": 1600,
        "status": true,
        "stock": 15,
        "category": "remeras",
        "thumbnails": "./images/remera02.jpg"
    },
    {
        "title": "Remera-03",
        "description": "Remera-03 Descripción",
        "code": "REM003",
        "price": 1700,
        "status": true,
        "stock": 25,
        "category": "remeras",
        "thumbnails": "./images/remera03.jpg"
    },
    {
        "title": "Remera-04",
        "description": "Remera-04 Descripción",
        "code": "REM004",
        "price": 1800,
        "status": true,
        "stock": 30,
        "category": "remeras",
        "thumbnails": "./images/remera04.jpg"
    },
    {
        "title": "Buzo-01",
        "description": "Buzo-01 Descripción",
        "code": "BUZ001",
        "price": 2500,
        "status": true,
        "stock": 10,
        "category": "buzos",
        "thumbnails": "./images/buzo01.jpg"
    },
    {
        "title": "Buzo-02",
        "description": "Buzo-02 Descripción",
        "code": "BUZ002",
        "price": 2600,
        "status": true,
        "stock": 12,
        "category": "buzos",
        "thumbnails": "./images/buzo02.jpg"
    },
    {
        "title": "Buzo-03",
        "description": "Buzo-03 Descripción",
        "code": "BUZ003",
        "price": 2700,
        "status": true,
        "stock": 8,
        "category": "buzos",
        "thumbnails": "./images/buzo03.jpg"
    },
    {
        "title": "Buzo-04",
        "description": "Buzo-04 Descripción",
        "code": "BUZ004",
        "price": 2800,
        "status": true,
        "stock": 20,
        "category": "buzos",
        "thumbnails": "./images/buzo04.jpg"
    },
    {
        "title": "Buzo Estampado-01",
        "description": "Buzo Estampado-01 Descripción",
        "code": "BES001",
        "price": 3000,
        "status": true,
        "stock": 5,
        "category": "buzos estampados",
        "thumbnails": "./images/buzo_estampado01.jpg"
    },
    {
        "title": "Buzo Estampado-02",
        "description": "Buzo Estampado-02 Descripción",
        "code": "BES002",
        "price": 3100,
        "status": true,
        "stock": 7,
        "category": "buzos estampados",
        "thumbnails": "./images/buzo_estampado02.jpg"
    },
    {
        "title": "Buzo Estampado-03",
        "description": "Buzo Estampado-03 Descripción",
        "code": "BES003",
        "price": 3200,
        "status": true,
        "stock": 6,
        "category": "buzos estampados",
        "thumbnails": "./images/buzo_estampado03.jpg"
    },
    {
        "title": "Buzo Estampado-04",
        "description": "Buzo Estampado-04 Descripción",
        "code": "BES004",
        "price": 3300,
        "status": true,
        "stock": 10,
        "category": "buzos estampados",
        "thumbnails": "./images/buzo_estampado04.jpg"
    }
];





export default ProductsMongoManager