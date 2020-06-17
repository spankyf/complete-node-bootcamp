// const validator = require('validator');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING(200),
      //   allowNull: false,
      validate: {
        notNull: {
          msg: 'A user has to have a name'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      //   allowNull: false,
      //   unique: true,
      validate: {
        isEmail: true,
        unique: {
          messsge: 'Has to be unique'
        }
      }
    },
    photo: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      //   allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        len: {
          args: [8, 32],
          msg: 'String length is not in this range'
        }
      }
    },
    passwordConfirm: { type: Sequelize.STRING, validate: { notNull: { msg: 'Please confirm password' } } }
  });

  return User;
};
