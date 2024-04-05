import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
  constructor() {
    this.path = './products.json';
  }

  readFile = async () => {
    try {
      const file = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(file);
    } catch {
      return [];
    }
  };

  writeFile = async (file) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(file, null, 2), 'utf-8');
    } catch (err) {
      console.log(err);
    }
  };

  codeValidation = (objeto, products) => {
    const codeValidation = products.some((product) => objeto.code === product.code);
    if (codeValidation) {
      throw new Error('El codigo corresponde a otro producto');
    }
  };

  addProduct = async (objeto) => {
    try {
      if (!objeto.code || !objeto.title || !objeto.description || !objeto.price || !objeto.thumbnail || !objeto.stock) {
        throw new Error('Todos los campos son obligatorios');
      }

      const products = await this.readFile();

      this.codeValidation(objeto, products);

      const newProduct = {
        id: uuidv4(),
        code: objeto.code,
        title: objeto.title,
        description: objeto.description,
        price: parseFloat(objeto.price),
        thumbnail: objeto.thumbnail,
        stock: parseInt(objeto.stock),
      };
      await products.push(newProduct);

      await this.writeFile(products);
    } catch (error) {
      console.log(error);
    }
  };

  getProducts = async () => {
    const products = await this.readFile();
    return products;
  };

  getProductById = async (id) => {
    try {
      const products = await this.readFile();
      const productFound = products.find((product) => product.id === id);
      return productFound;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.readFile();
      const indexToDelete = products.findIndex((p) => p.id === id);

      if (indexToDelete < 0) {
        throw new Error(`El ${id} no corresponde a ningun producto en existencia`);
      }

      products.splice(indexToDelete, 1);

      await this.writeFile(products);
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (id, productToUpdate) => {
    const products = await this.readFile();
    const indexToUpdate = products.findIndex((p) => p.id === id);

    if (indexToUpdate < 0) {
      throw new Error(`El ${id} no corresponde a ningun producto en existencia`);
    }

    this.codeValidation(productToUpdate, products);

    products[indexToUpdate] = { ...products[indexToUpdate], ...productToUpdate, id };

    await this.writeFile(products);
  };
}
// Agrega los productos al final del archivo ProductManager.js

// Agregar productos
const addProducts = async () => {
  try {
    await this.addProduct({
      title: 'producto prueba 1',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 111,
      stock: 25,
    });

    await this.addProduct({
      title: 'producto prueba 2',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 112,
      stock: 25,
    });

    await this.addProduct({
      title: 'producto prueba 3',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 113,
      stock: 25,
    });

    await this.addProduct({
      title: 'producto prueba 4',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 114,
      stock: 25,
    });

    await this.addProduct({
      title: 'producto prueba 5',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 115,
      stock: 25,
    });

    await this.addProduct({
      title: 'producto prueba 6',
      description: 'Este es un producto prueba',
      price: 300,
      thumbnail: 'Sin imagen',
      code: 116,
      stock: 25,
    });

    console.log('Productos agregados exitosamente');
  } catch (error) {
    console.log(error);
  }
};

addProducts();
