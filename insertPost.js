const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const databasePath = path.join(__dirname, 'posts.db');

const database = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Could not connect to the database:', error.message);
    process.exit(1);
  }
});

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        topic TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `;

    database.run(sql, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function insertPost(post) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO posts (title, content, category, topic, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      post.title,
      post.content,
      post.category,
      post.topic,
      post.date
    ];

    database.run(sql, values, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this.lastID);
    });
  });
}

function createSamplePost() {
  return {
    title: 'My First Post',
    content: 'This is a sample post inserted from Node.js.',
    category: 'Technology',
    topic: 'JavaScript',
    date: new Date().toISOString()
  };
}

async function main() {
  try {
    await initializeDatabase();

    const samplePost = createSamplePost();
    const insertedId = await insertPost(samplePost);

    console.log(`Inserted post with id ${insertedId}`);
  } catch (error) {
    console.error('Insert failed:', error.message);
  } finally {
    database.close();
  }
}

main();
