const express = require('express');
const ProductManager = require('./ProductManager'); // Importar la clase ProductManager desde el archivo correspondiente
const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor

// Crear una instancia de ProductManager
const productManager = new ProductManager('./products.json'); // Ruta al archivo de productos

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error al obtener producto por ID" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
