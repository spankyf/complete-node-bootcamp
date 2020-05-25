const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: './starter/config.env' });
exports.insertTour = (bodyRequest) => {
  const client = new Client({
    connectionString: process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    ),
    ssl: { rejectUnauthorized: false }
  });
  client.connect();
  client
    .query(
      `INSERT INTO tour SELECT name, rating, price FROM json_populate_record (NULL::tour,'${JSON.stringify(
        bodyRequest
      )}');`
    )
    .then((res) => 20)
    .catch((e) => console.error(e.stack))
    .then(() => client.end());
};

exports.selectAll = () => {
  const client = new Client({
    connectionString: process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    ),
    ssl: { rejectUnauthorized: false }
  });
  client.connect();
  client
    .query('SELECT * FROM tour;')
    .then((res) => console.log(res.rows))
    .catch((e) => console.error(e.stack))
    .then(() => client.end());
};
