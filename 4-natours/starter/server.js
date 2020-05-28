const dotenv = require('dotenv');
const app = require('./app');

const db = require('./models');

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
});

dotenv.config({ path: './starter/config.env' });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
