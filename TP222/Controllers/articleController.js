const db = require('../database/db');

exports.createArticle = (req, res) => {
  const { titre, contenu, auteur, date, categorie, tags } = req.body;

  // ✅ Validation
  if (!titre || titre.trim() === '')
    return res.status(400).json({ error: "Le titre est obligatoire" });
  if (!auteur || auteur.trim() === '')
    return res.status(400).json({ error: "L'auteur est obligatoire" });
  if (!contenu || contenu.trim() === '')
    return res.status(400).json({ error: "Le contenu est obligatoire" });
  if (!date || date.trim() === '')
    return res.status(400).json({ error: "La date est obligatoire" });

  db.run(
    `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [titre, contenu, auteur, date, categorie, tags],
    function(err) {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.getAllArticles = (req, res) => {
  db.all("SELECT * FROM articles", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getOneArticle = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM articles WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Article non trouvé" });
    res.json(row);
  });
};

exports.updateArticle = (req, res) => {
  const id = req.params.id;
  const { titre, contenu, auteur, date, categorie, tags } = req.body;

  // ✅ Validation
  if (!titre || titre.trim() === '')
    return res.status(400).json({ error: "Le titre est obligatoire" });
  if (!auteur || auteur.trim() === '')
    return res.status(400).json({ error: "L'auteur est obligatoire" });
  if (!contenu || contenu.trim() === '')
    return res.status(400).json({ error: "Le contenu est obligatoire" });

  const sql = `
    UPDATE articles
    SET titre = ?, contenu = ?, auteur = ?, date = ?, categorie = ?, tags = ?
    WHERE id = ?`;

  db.run(sql, [titre, contenu, auteur, date, categorie, tags, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Article non trouvé" });
    res.json({ message: "Article mis à jour" });
  });
};

exports.deleteArticle = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM articles WHERE id = ?";

  db.run(sql, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Article non trouvé" });
    res.json({ message: "Article supprimé" });
  });
};
