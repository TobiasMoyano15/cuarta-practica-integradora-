const fs = require('fs').promises; 

class ProductManager {
  constructor(filePath) {
    this.path = filePath; 
    this.lastProductId = 0;
  }

  async addProduct(product) {
    try {
      
      const existingProducts = await this.getProducts();

     
      this.lastProductId++;
      product.id = this.lastProductId;

      
      existingProducts.push(product);

      
      await fs.writeFile(this.path, JSON.stringify(existingProducts, null, 2));

      console.log("Producto agregado correctamente:", product);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async getProducts() {
    try {
      
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      
      return [];
    }
  }

  async getProductById(id) {
    try {
     
      const products = await this.getProducts();

      
      const product = products.find(product => product.id === id);

      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      
      const products = await this.getProducts();

      
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        
        products[productIndex] = { ...products[productIndex], ...updatedFields };

        
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        console.log("Producto actualizado correctamente:", products[productIndex]);
      } else {
        console.error("Producto no encontrado para actualizar.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      
      let products = await this.getProducts();

      
      products = products.filter(product => product.id !== id);

      
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));

      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }
}

// Ejemplo de uso
const productManager = new ProductManager('products.json'); // Especificar el nombre del archivo de productos

// Agregar productos
productManager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10.99,
  thumbnail: "imagen1.jpg",
  code: "ABC123",
  stock: 20
});

// Obtener todos los productos
productManager.getProducts()
  .then(products => console.log("Todos los productos:", products))
  .catch(error => console.error("Error al obtener productos:", error));

// Obtener un producto por su ID
productManager.getProductById(2)
  .then(product => console.log("Producto encontrado por ID:", product))
  .catch(error => console.error("Error al obtener producto por ID:", error));

// Actualizar un producto por su ID
productManager.updateProduct(1, { price: 15.99, stock: 25 });

// Eliminar un producto por su ID
productManager.deleteProduct(3);
