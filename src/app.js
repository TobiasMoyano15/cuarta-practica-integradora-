import express from 'express';
import ProductManager from './ProductManager.js';

const productManager = new ProductManager();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  let { limit } = req.query;
  const products = await productManager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send({ status: 'success', payload: limitedProducts });
  }
  res.send({ status: 'success', payload: products });
});

app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const productFound = await productManager.getProductById(pid);
  if (!productFound) {
    res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
  }
  res.send({ status: 'success', payload: productFound });
});

app.listen(8080, (err) => {
  if (err) console.log(err);
  console.log('Servidor escuchando en el puerto 8080');
});
