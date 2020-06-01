const dotenv = require('dotenv');
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelizeTransforms = require('sequelize-transforms');

dotenv.config({ path: './config.env' });
// sconsole.log(process.env);
const URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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
sequelizeTransforms(sequelize);
db.sequelize.sync().then(() => {
  console.log('Drop and re-sync db.');
});
// db.sequelize.sync().then(() => {
//   console.log('Drop and re-sync db.');
// });
const Tour = db.tours;
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`)
);

const importData = async () => {
  try {
    await Tour.create(tours);

    console.log('Date inputted successfully');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.destroy({
      where: {},
      truncate: true
    });

    console.log('Data delete successfully');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === '---delete') {
  deleteData();
}

console.log(process.argv);
