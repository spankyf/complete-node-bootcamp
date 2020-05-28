module.exports = (sequelize, Sequelize) => {
  const Tour = sequelize.define('tours', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
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
