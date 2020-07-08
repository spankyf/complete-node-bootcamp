const dotenv = require('dotenv');
const importData = require('./dev-data/data/import-dev-data');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Exception. Shutting down...');

  process.exit(1);
});

dotenv.config({ path: './starter/config.env' });
const app = require('./app');

const db = require('./models');
// was set to { force: true }, now I changed it and seems to keep the data once server restarted. Use node dev... and --import right after
db.sequelize.sync({ force: true }).then(() => {
  importData();
  console.log('Drop and re-sync db.');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
