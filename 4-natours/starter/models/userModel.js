const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

// async function hashPassword(user, options) {
//   if (!user.changed('password')) {
//     return 0;
//   }
//   user.password = await bcrypt.hash(user.password, SALT_FACTOR);
// }

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING(200),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A user has to have a name'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },
    photo: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
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
    passwordConfirm: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        function(el) {
          if (el !== this.password) {
            throw new AppError('The passwords dont match');
          }
        }
      }
    }
  });

  User.beforeCreate(async (user, options) => {
    if (!user.changed('password')) {
      return 0;
    }
    user.password = await bcrypt.hash(user.password, 12);
  });
  User.beforeUpdate(async (user, options) => {
    if (!user.changed('password')) {
      return 0;
    }
    user.password = await bcrypt.hash(user.password, 12);
  });

  return User;
};
