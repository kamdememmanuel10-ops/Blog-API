const express = require('express');
const router = express.Router();

const controller = require('../controllers/articleController');

/**
 * @swagger
 * /api/article:
 *   post:
 *     summary: Créer un article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               auteur:
 *                 type: string
 *               date:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article créé
 */
router.post('/', controller.createArticle);

/**
 * @swagger
 * /api/article:
 *   get:
 *     summary: Voir tous les articles
 *     responses:
 *       200:
 *         description: Liste des articles
 */

router.get('/', controller.getAllArticles);

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Voir un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 */

router.get('/:id', controller.getOneArticle);

/**
 * @swagger
 * /api/article/{id}:
 *   put:
 *     summary: Modifier un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article modifié
 */

router.put('/:id', controller.updateArticle);

/**
 * @swagger
 * /api/article/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 */

router.delete('/:id', controller.deleteArticle);

module.exports = router;
