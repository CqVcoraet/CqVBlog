const express = require('express');
const sqlite3 = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const databasePath = path.join(__dirname, 'posts.db');
const database = new sqlite3.Database(databasePath);

const pool = new Pool({
  host: ''
});

function initializeDatabase() {
  database.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      topic TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
}

app.post('/posts', (req, res) => {
  const { title, content, category, topic, date } = req.body;

  if (!title || !content || !topic) {
    return res.status(400).json({ error: 'Title, content, and topic are required.' });
  }

  const postDate = date || new Date().toISOString();

  const sql = `
    INSERT INTO posts (title, content, category, topic, date)
    VALUES (?, ?, ?, ?, ?)
  `;

  database.run(sql, [title, content, category, topic, postDate], function (error) {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ id: this.lastID });
  });
});

initializeDatabase();

app.listen(port, () => {
  console.log(`Server listening on http://127.0.0.1:${port}`);
});
