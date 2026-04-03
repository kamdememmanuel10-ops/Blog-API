# 📝 Blog API — Emmanuel

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**Application complète de gestion d'articles de blog**  
API REST Backend + Interface Frontend React

🔗 **API Live :** [https://blog-api-emmanuel.onrender.com](https://blog-api-emmanuel.onrender.com)  
📖 **Swagger Docs :** [https://blog-api-emmanuel.onrender.com/api-docs](https://blog-api-emmanuel.onrender.com/api-docs)

</div>

---

## 👤 Auteur

| Champ | Détail |
|-------|--------|
| **Nom complet** | KAMDEM NDEFFO FRANCK EMMANUEL |
| **Matricule** | 24F2805 |
| **Filière** | Informatique |
| **Université** | Université de Yaoundé I |
| **UE** | INF222 — EC1 Développement Backend |
| **Année** | 2025 — 2026 |

---

## 📋 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Architecture](#-architecture)
3. [Fonctionnalités](#-fonctionnalités)
4. [Technologies utilisées](#-technologies-utilisées)
5. [Installation et démarrage](#-installation-et-démarrage)
6. [Documentation API](#-documentation-api)
7. [Utilisation du frontend](#-utilisation-du-frontend)
8. [Déploiement](#-déploiement)
9. [Structure du projet](#-structure-du-projet)
10. [Problèmes connus](#-problèmes-connus)

---

## 🎯 Présentation du projet

**Blog API Emmanuel** est une application web full-stack permettant la gestion complète d'articles de blog. Elle est composée de deux parties :

- **Backend** : une API REST construite avec Node.js et Express, utilisant SQLite comme base de données, documentée avec Swagger et déployée sur Render.
- **Frontend** : une interface React moderne, animée et responsive, connectée à l'API et permettant d'effectuer toutes les opérations CRUD directement depuis le navigateur.

---

## 🏗️ Architecture

```
Blog-API-Emmanuel/
│
├── 📁 Backend (racine du projet)
│   ├── src/
│   │   ├── app.js                  ← Point d'entrée du serveur
│   │   ├── Controllers/
│   │   │   └── articleController.js
│   │   ├── Routes/
│   │   │   └── articlesRoutes.js
│   │   ├── DataBase/
│   │   │   └── db.js
│   │   └── Swaggers/
│   │       └── swagger.js
│   ├── package.json
│   └── README.md
│
└── 📁 Frontend
    ├── src/
    │   └── App.jsx                 ← Interface React complète
    ├── public/
    │   └── index.html
    └── package.json
```

---

## ✨ Fonctionnalités

### Backend — API REST
- ✅ Récupérer tous les articles
- ✅ Récupérer un article par son ID
- ✅ Créer un nouvel article
- ✅ Modifier complètement un article (PUT)
- ✅ Modifier partiellement un article (PATCH)
- ✅ Supprimer un article
- ✅ Documentation Swagger interactive
- ✅ Base de données SQLite persistante

### Frontend — Interface React
- ✅ Dashboard avec statistiques en temps réel
- ✅ Liste des articles en grille animée
- ✅ Formulaire de création d'article
- ✅ Modal de modification
- ✅ Suppression avec confirmation
- ✅ Indicateur de statut API en direct
- ✅ Notifications toast pour chaque action
- ✅ Fond animé 
- ✅ Design sombre (noir / bleu / gris / blanc)

---

## 🛠️ Technologies utilisées

### Backend
| Technologie | Rôle |
|------------|------|
| **Node.js** | Environnement d'exécution JavaScript |
| **Express.js** | Framework web et gestion des routes |
| **better-sqlite3** | Base de données SQLite |
| **swagger-ui-express** | Documentation interactive |
| **cors** | Gestion des accès cross-origin |

### Frontend
| Technologie | Rôle |
|------------|------|
| **React 18** | Framework UI |
| **CSS pur** | Styles et animations |
| **Canvas API** | Fond animé de particules |
| **Fetch API** | Requêtes vers le backend |

---

## ⚙️ Installation et démarrage

### Prérequis

- **Node.js** v16 ou supérieur — [télécharger](https://nodejs.org)
- **Git** — [télécharger](https://git-scm.com)
- **npm** (inclus avec Node.js)

---

### 🔧 Backend

```bash
# 1. Cloner le repo
git clone https://github.com/kamdemememmanuel10-ops/Blog-API.git

# 2. Accéder au dossier
cd Blog-API

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur
node src/app.js
```

Le serveur démarre sur :
```
http://localhost:3000
```

La documentation Swagger est accessible sur :
```
http://localhost:3000/api-docs
```

---

### 🎨 Frontend

```bash
# 1. Créer un projet React
npx create-react-app frontend

# 2. Accéder au dossier
cd frontend

# 3. Remplacer src/App.jsx par le fichier fourni

# 4. Lancer l'application
npm start
```

L'interface sera disponible sur :
```
http://localhost:3000
```

> ⚠️ **Note CORS** : si tu lances le frontend en local et que les requêtes échouent, assure-toi que CORS est activé dans le backend (voir section Problèmes connus).

---

## 📖 Documentation API

### URL de base

```
https://blog-api-emmanuel.onrender.com/api/articles
```

### Endpoints

| Méthode | Route | Description | Corps requis |
|--------|-------|-------------|-------------|
| `GET` | `/api/articles` | Récupérer tous les articles | — |
| `GET` | `/api/articles/:id` | Récupérer un article par ID | — |
| `POST` | `/api/articles` | Créer un nouvel article | ✅ JSON |
| `PUT` | `/api/articles/:id` | Modifier complètement un article | ✅ JSON |
| `PATCH` | `/api/articles/:id` | Modifier partiellement un article | ✅ JSON partiel |
| `DELETE` | `/api/articles/:id` | Supprimer un article | — |

### Modèle d'un article

```json
{
  "id": 1,
  "titre": "Mon premier article",
  "contenu": "Contenu de l'article ici...",
  "auteur": "KAMDEM Emmanuel",
  "date": "2026-03-23",
  "categorie": "Tech",
  "tags": "nodejs, api, backend"
}
```

### Exemples de requêtes

**Créer un article (POST)**
```bash
curl -X POST https://blog-api-emmanuel.onrender.com/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Mon article",
    "contenu": "Contenu ici",
    "auteur": "Emmanuel",
    "date": "2026-03-23",
    "categorie": "Tech",
    "tags": "nodejs"
  }'
```

**Récupérer tous les articles (GET)**
```bash
curl https://blog-api-emmanuel.onrender.com/api/artic
```

**Supprimer un article (DELETE)**
```bash
curl -X DELETE https://blog-api-emmanuel.onrender.com/api/articles/1
```

---

## 🖥️ Utilisation du frontend

Une fois l'application lancée, tu accèdes à trois vues depuis la sidebar :

| Vue | Description |
|-----|-------------|
| **Dashboard** | Statistiques globales + aperçu des derniers articles + formulaire rapide |
| **Tous les articles** | Liste complète avec options de modification et suppression |
| **Créer un article** | Formulaire complet de création |

### Actions disponibles

- **Créer** → remplis le formulaire et clique sur "Publier l'article"
- **Modifier** → clique sur ✏️ sur une carte article → modifie dans le modal → "Enregistrer"
- **Supprimer** → clique sur ✕ sur une carte article → confirme la suppression
- **Rafraîchir** → clique sur le bouton "↻ Refresh" dans la topbarles

---

## 🚀 Déploiement

### Backend — Render

1. Pusher le code sur GitHub
2. Aller sur [render.com](https://render.com) et se connecter avec GitHub
3. Créer un **Web Service** et sélectionner le repo
4. Configurer les commandes :
   - **Build Command :** `npm install`
   - **Start Command :** `node src/app.js`
5. Cliquer **Deploy** et récupérer l'URL publique générée

### Frontend — Vercel

```bash
npm run build
npm install -g vercel
vercel
```

### Frontend — Netlify

```bash
npm run build
# Glisser-déposer le dossier /build sur netlify.com
```

---

## 🐛 Problèmes connus

### Erreur CORS en local

**Symptôme :** requêtes bloquées avec `Access-Control-Allow-Origin`  
**Solution :** activer CORS dans `src/app.js` :

```bash
npm install cors
```

```js
const cors = require('cors');
app.use(cors());
```

### API lente au premier appel

**Cause :** Render (plan gratuit) met le service en veille après 15 min d'inactivité  
**Solution :** la première requête peut prendre 30 à 50 secondes — c'est normal

### Données non persistantes sur Render

**Cause :** le système de fichiers de Render est éphémère, SQLite se réinitialise  
**Solution future :** migrer vers PostgreSQL avec le service Render Database

---

## 📄 Licence

Projet académique — INF222, Université de Yaoundé I  
© 2026 **KAMDEM NDEFFO FRANCK EMMANUEL** — Tous droits réservés
