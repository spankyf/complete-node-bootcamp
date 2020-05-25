const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: './starter/config.env' });
const app = require('./app');

const client = new Client({
  connectionString: process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  ),
  ssl: { rejectUnauthorized: false }
});
client.connect();
// 'CREATE TABLE tour (name VARCHAR(20) NOT NULL,rating REAL DEFAULT 9.99, price REAL NOT NULL) VALUES (wrds, 2.5, 4.5) ;'
// 'INSERT INTO tour VALUES ('something', 2.5,4.5);'
client
  .query("INSERT INTO tour VALUES ('something', 2.5,4.5);")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
// client.end();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
