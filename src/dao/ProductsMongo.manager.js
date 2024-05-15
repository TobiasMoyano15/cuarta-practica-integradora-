import productsModel from "./models/product.model";



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
        "title": "Té-01",
        "description": "té-01 Descripción",
        "code": "TEA001",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "te",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Té-02",
        "description": "té-02 Descripción",
        "code": "TEA002",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "te",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Té-03",
        "description": "té-03 Descripción",
        "code": "TEA003",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "te",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Té-04",
        "description": "té-04 Descripción",
        "code": "TEA004",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "te",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Muffin-01",
        "description": "Muffin-01 Descripción",
        "code": "EAT001",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "comestibles",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Muffin-02",
        "description": "Muffin-02 Descripción",
        "code": "EAT002",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "comestibles",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Muffin-03",
        "description": "Muffin-03 Descripción",
        "code": "EAT003",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "comestibles",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Muffin-04",
        "description": "Muffin-04 Descripción",
        "code": "EAT004",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "comestibles",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Jugo-01",
        "description": "Jugo-01 Descripción",
        "code": "JUI001",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "jugos",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Jugo-02",
        "description": "Jugo-02 Descripción",
        "code": "JUI002",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "jugos",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Jugo-03",
        "description": "Jugo-03 Descripción",
        "code": "JUI003",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "jugos",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
    {
        "title": "Jugo-04",
        "description": "Jugo-04 Descripción",
        "code": "JUI004",
        "price": 215,
        "status": true,
        "stock": 30,
        "category": "jugos",
        "thumbnails": "./images/IMG_placeholder.jpg"
    },
]



export default ProductsMongoManager