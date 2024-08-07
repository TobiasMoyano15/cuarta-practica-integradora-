const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API information',
            contact: {
                name: 'Developer',
            },
            servers: [{ url: 'http://localhost:5000' }],
        },
    },
    apis: ['./routes/products.js', './routes/cart.js'], // Solo incluir productos y carrito
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerUi, swaggerDocs };
