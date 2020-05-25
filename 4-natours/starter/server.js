const dotenv = require('dotenv');
const { Client } = require('pg');
// const { insertQuery } = require('./models/tourModel');

dotenv.config({ path: './starter/config.env' });
const app = require('./app');

// const client = new Client({
//   connectionString: process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
//   ),
//   ssl: { rejectUnauthorized: false }
// });
// client.connect();

// const postReq = {
//   name: 'Grand Tour',
//   rating: 10,
//   price: 199.99
// };

// insertJSON(postReq);
// const testQuery = JSON.stringify(postReq);

// client
//   .query(insertQuery(postReq))
//   .then((res) => console.log(res.rows))
//   .catch((e) => console.error(e.stack))
//   .then(() => client.end());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
