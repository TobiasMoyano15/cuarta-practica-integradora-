class ProductManager {
    #products;
    
    constructor() {
        this.#products = [];
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {

        const product = {
            id: this.getNextId(),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };
        
        const codeExistsCheck = this.#products.find((prod) => prod.code === code);
        
        let completeProductCheck = [];
        for (const prop in product) {
            if (!product[prop]) {
                completeProductCheck.push(prop);
            }
        }
        

        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            if(completeProductCheck > 1) {
                throw new Error(`¡ERROR! debe llenar todods los campos del producto nuevo\nFaltaron agregar ${completeProductCheck.join(', ')}`);
            } else {
                throw new Error(`¡ERROR! debe llenar todods los campos del producto nuevo\nFaltó agregar ${completeProductCheck.join(', ')}`);
            }   
        } else if(codeExistsCheck){
            throw new Error(`¡ERROR! Producto ${product.title} no agregado\nEl código ${product.code} ya está siendo utlizado por el producto ${codeExistsCheck.title}, con el id ${codeExistsCheck.id}`);
            } else {
                this.#products.push(product);
                };
    };
    
    getProducts() {
        return this.#products;
    };

    getProductsById(productId) {
        const idCheck = this.#products.find((prod) => prod.id == productId);
        
        if (idCheck) {
            return idCheck;
        } else {
            throw new Error(`¡ERROR! No existe ningún producto con el id ${productId}`);
          };
    };   
        
    getNextId() {
        if (this.#products.length === 0) {
        return 1;
      };
      return this.#products[this.#products.length -1].id + 1;
    };
};