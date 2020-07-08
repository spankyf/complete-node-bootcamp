const dotenv = require('dotenv').config({
  path: 'config.env'
});
const fs = require('fs');
const db = require('../../models');
// const moment = require('moment');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const importData = async (req, res) => {
  try {
    await db.tours.bulkCreate(tours);
    await db.users.bulkCreate(users);
    console.log('Data inserted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteAll = async (req, res) => {
  try {
    await Tour.destroy({
      where: {}
    });
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  console.log('Trying to import now...');
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAll();
}
// console.log(process.argv);
