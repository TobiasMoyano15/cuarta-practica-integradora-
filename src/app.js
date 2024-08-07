import express from 'express';
import productsRouter from './routes/ProductRouter.js';
import cartRouter from './routes/CartRouter.js';
import viewsRouter from './routes/ViewRouter.js';
import path from 'path';
import multer from 'multer'; 
import handlebars from 'express-handlebars';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import { swaggerUi, swaggerDocs } from '../src/swagger.js'; 

const app = express();

const httpServer = createServer(app); 

const io = new Server(httpServer); 

const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Corrige el path de la carpeta public

app.engine('hbs', handlebars({
    extname: '.hbs'
}));

app.set('views', path.join(__dirname, 'views')); // Corrige el path de la carpeta views
app.set('view engine', 'hbs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Corrige el path de la carpeta uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploader = multer({ storage: storage });

app.use('/upload-file', uploader.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('No se pudo subir el archivo');
    }
    res.status(200).send('Archivo subido con éxito');
});

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let messages = [];
io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
    console.log('API Docs available at http://localhost:8080/api-docs');
});

export default app;
