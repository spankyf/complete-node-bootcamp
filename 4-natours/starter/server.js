const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = require('./app');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./models');

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and re-sync db.');
});

const tourModel = db.sequelize.define('tour', {
  name: {
    type: db.Sequelize.STRING(20),
    allowNull: false
  },
  rating: {
    type: db.Sequelize.REAL
  },
  price: {
    type: db.Sequelize.BOOLEAN,
    allowNull: false
  }
});

// const Tour = tourModel.create()

dotenv.config({ path: './starter/config.env' });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
