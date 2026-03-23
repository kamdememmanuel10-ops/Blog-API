const Database = require('better-sqlite3');
const path = require('path');

const dbpath = path.join(__dirname, 'database.db');

const db = new Database(dbpath, {fileMustExist: false });

db.pragma('journal_mode = WAL');

module.exports = db;


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
