module.exports = (sequelize, Sequelize) => {
  const Tour = sequelize.define('tours', {
    id: {
      // type: Sequelize.UUID,
      // defaultValue: Sequelize.UUIDV1,
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING(2000),
      allowNull: false,
      unique: true
    },
    ratingsAverage: {
      type: Sequelize.REAL,
      defaultValue: 4.5,
      validate: {
        isNumeric: true
      }
    },
    ratingsQuantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isNumeric: true
      }
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A tour has to have a duration'
        }
      }
    },
    maxGroupSize: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A tour has to have a maximum group size'
        }
      }
    },
    difficulty: {
      type: Sequelize.STRING(2000),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A tour has to have a difficulty'
        }
      }
    },
    price: {
      type: Sequelize.REAL,
      allowNull: false
    },
    priceDiscount: {
      type: Sequelize.REAL
    },
    summary: {
      type: Sequelize.STRING(2000),
      allowNull: false,
      trim: true,
      validate: {
        notNull: {
          msg: 'A tour has to have a summary'
        }
      }
    },
    description: {
      type: Sequelize.STRING(2000),
      trim: true
    },
    imageCover: {
      type: Sequelize.STRING(2000),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A tour has to have a cover image'
        }
      }
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING(2000))
    },
    startDates: { type: Sequelize.ARRAY(Sequelize.DATE) }
  });

  return Tour;
};

// Tour.beforeCreate(function () {
//   console.log('save');
// });
