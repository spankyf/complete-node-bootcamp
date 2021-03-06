const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

// async function hashPassword(user, options) {
//   if (!user.changed('password')) {
//     return 0;
//   }
//   user.password = await bcrypt.hash(user.password, SALT_FACTOR);
// }

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'users',
    {
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
      role: { type: Sequelize.ENUM(['user', 'guide', 'lead-guide', 'admin']), defaultValue: 'user' },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          len: {
            args: [8, 255],
            msg: 'String length is not in this range'
          }
        }
      },
      passwordConfirm: {
        type: Sequelize.STRING,
        // allowNull: false,
        validate: {
          function(el) {
            if (el !== this.password) {
              throw new AppError('The passwords dont match');
            }
          }
        }
      },
      passwordChangedAt: { type: Sequelize.DATE },
      passwordResetToken: { type: Sequelize.STRING },
      passwordResetTokenExpires: { type: Sequelize.DATE },
      active: { type: Sequelize.BOOLEAN, defaultValue: true }
    },
    {
      defaultScope: {
        where: {}
      },
      scopes: { returnAll: { where: { active: true }, attributes: { exclude: ['password', 'active'] } } } //  this is used in find all users
    }
  );

  User.beforeCreate(async (user, options) => {
    if (!user.changed('password')) {
      return 0;
    }
    user.password = await bcrypt.hash(user.password, 12);
  });

  User.beforeUpdate(async (user, options) => {
    if (!user.changed('password') || user.isNewRecord) return 0;
    user.passwordChangedAt = Date.now() - 1000;
    //next(); think you dont need next when using hooks
  });

  User.beforeFind(async (user, options) => {
    if (!user.active) return 0;
    user.passwordChangedAt = Date.now() - 1000;
    //next(); think you dont need next when using hooks
  });

  User.beforeUpdate(async (user, options) => {
    if (!user.changed('password')) {
      return 0;
    }
    user.password = await bcrypt.hash(user.password, 12);
  });

  User.prototype.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      console.log(changedTimestamp, JWTTimestamp);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    this.save();
    return resetToken;
  };

  return User;
};
