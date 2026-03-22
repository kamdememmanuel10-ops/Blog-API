# Blog API

API REST pour la gestion d'articles de blog.

## Technologies utilisées
- Node.js
- Express.js
- SQLite3
- Swagger UI

## Installation

\```bash
npm install
node app.js
\```

## Structure du projet

\```
TP 222/
├── app.js
├── Routes/
│   └── articlesRoutes.js
├── Controllers/
│   └── articleController.js
├── DataBase/
│   └── db.js
├── Swaggers/
│   └── swagger.js
└── package.json
\```

## Routes disponibles

| Méthode | Route | Description |
|---|---|---|
| POST | /api/article | Créer un article |
| GET | /api/article | Voir tous les articles |
| GET | /api/article/:id | Voir un article par ID |
| PUT | /api/article/:id | Modifier un article |
| DELETE | /api/article/:id | Supprimer un article |

## Validation des entrées
- Le **titre** est obligatoire
- L'**auteur** est obligatoire
- Le **contenu** est obligatoire
- La **date** est obligatoire

## Documentation Swagger
Lancer le serveur puis ouvrir :
http://localhost:3000/api-docs

## Auteur
Kamdem Ndeffo Franck Emmanuel
