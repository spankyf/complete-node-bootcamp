const dotenv = require('dotenv');
const Sequelize = require('sequelize');
// const sequelizeTransforms = require('sequelize-transforms');
const sequelizePaginate = require('sequelize-paginate');

dotenv.config({ path: './starter/config.env' });
const URI = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const sequelize = new Sequelize(URI, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
sequelizePaginate.paginate(sequelize);
// sequelizeTransforms(sequelize);
db.Op = Sequelize.Op;

db.tours = require('./tourModel')(sequelize, Sequelize);

module.exports = db;
