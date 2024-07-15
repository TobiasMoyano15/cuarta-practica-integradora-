class ProductManager {
    #products;

    constructor() {
        this.#products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            id: this.getNextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        const codeExistsCheck = this.#products.find((prod) => prod.code === code);

        let completeProductCheck = [];
        for (const prop in product) {
            if (!product[prop]) {
                completeProductCheck.push(prop);
            }
        }

        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            if (completeProductCheck.length > 1) {
                throw new Error(`¡ERROR! debe llenar todos los campos del producto nuevo\nFaltaron agregar ${completeProductCheck.join(', ')}`);
            } else {
                throw new Error(`¡ERROR! debe llenar todos los campos del producto nuevo\nFaltó agregar ${completeProductCheck.join(', ')}`);
            }
        } else if (codeExistsCheck) {
            throw new Error(`¡ERROR! Producto ${product.title} no agregado\nEl código ${product.code} ya está siendo utilizado por el producto ${codeExistsCheck.title}, con el id ${codeExistsCheck.id}`);
        } else {
            this.#products.push(product);
        }
    }

    getProducts() {
        return this.#products;
    }

    getProductBy(filter) {
        try {
            const foundProduct = this.#products.find(prod => Object.keys(filter).every(key => prod[key] === filter[key]));

            if (foundProduct) return foundProduct;
            return [];
        } catch (error) {
            return error;
        }
    }

    getProductsById(productId) {
        const idCheck = this.#products.find((prod) => prod.id === productId);

        if (idCheck) {
            return idCheck;
        } else {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${productId}`);
        }
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.#products.findIndex((prod) => prod.id === productId);

        if (productIndex === -1) {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${productId}`);
        }

        const updatedProduct = { ...this.#products[productIndex], ...updatedFields };

        this.#products[productIndex] = updatedProduct;
    }

    removeProduct(productId) {
        const productIndex = this.#products.findIndex((prod) => prod.id === productId);

        if (productIndex === -1) {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${productId}`);
        }

        this.#products.splice(productIndex, 1);
    }

    getNextId() {
        if (this.#products.length === 0) {
            return 1;
        }
        return this.#products[this.#products.length - 1].id + 1;
    }
}

export default ProductManager;
