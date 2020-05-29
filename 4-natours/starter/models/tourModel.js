module.exports = (sequelize, Sequelize) => {
  const Tour = sequelize.define('tours', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    rating: {
      type: Sequelize.REAL
    },
    price: {
      type: Sequelize.REAL,
      allowNull: false
    }
  });

  return Tour;
};
