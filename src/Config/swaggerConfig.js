import __dirname from "../utils/filenameUtils.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de la API de Coffee Shop',
            description: 'Documentacion de la API de la app de Coffee Shop'
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local server"
            }
        ]
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

export default swaggerOptions;