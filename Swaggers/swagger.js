const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Documentation deb mon API',
    },
    servers : [
      {url: 'http://localhost:3000'}
    ],
  },
  apis: ['./routes/*.js'], //chemin vers le fichier route
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };