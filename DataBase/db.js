const Database = require('better-sqlite3').verbose();

const db = new better-sqlite3.Database('./blog.db')

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            titre TEXT,
            contenu TEXT,
            auteur TEXT,
            date TEXT,
            categorie TEXT,
            tags TEXT
            )
        `);
});
