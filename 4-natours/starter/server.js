const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: './starter/config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
