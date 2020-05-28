const dotenv = require('dotenv');
const app = require('./app');

const db = require('./models');
// was set to { force: true }, now I changed it and seems to keep the data once server restarted
db.sequelize.sync().then(() => {
  console.log('Drop and re-sync db.');
});

dotenv.config({ path: './starter/config.env' });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
