const express = require('express');
const app = express();

app.use(express.json());

const articleRoutes = require('./Routes/articlesRoutes');
app.use('/api/article', articleRoutes);

const { swaggerUi, swaggerSpec } = require('./Swaggers/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log('serveur lancé sur http://localhost:3000');
    console.log('Swagger sur http://localhost:3000/api-docs')
});

