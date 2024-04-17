import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import socketio from 'socket.io';
import ProductManager from './ProductManager.js';

const productManager = new ProductManager();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main' // O el nombre del layout principal que quieras utilizar
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

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

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('new product', (productData) => {
    io.emit('update products', productData);
  });
});

server.listen(8080, (err) => {
  if (err) console.log(err);
  console.log('Servidor escuchando en el puerto 8080');
});