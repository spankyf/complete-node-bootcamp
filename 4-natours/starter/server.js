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
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
