const db = require('../models');
const Op = db.Op;

const Tour = db.tours;

function adjustQuery(query) {
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    const test = Object.getOwnPropertyNames(query[keys[i]]).toString();

    switch (test) {
      case 'gte':
        query[keys[i]] = { [Op.gte]: query[keys[i]].gte };
        break;
      case 'lte':
        query[keys[i]] = { [Op.lte]: query[keys[i]].lte };
        break;
      case 'lt':
        query[keys[i]] = { [Op.lt]: query[keys[i]].lt };
        break;
      case 'gt':
        query[keys[i]] = { [Op.gt]: query[keys[i]].gt };
        break;
      default:
        // test = test;
        break;
    }
  }
  return query;
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const advancedQuery = adjustQuery(queryObj);

    const query = Tour.findAll({
      where: advancedQuery
    });

    const tours = await query;

    res.status(201).json({
      status: 'success',
      results: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  // Validate request
  try {
    const tour = await Tour.findByPk(req.params.id);

    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  // Validate request
  try {
    const updatedTour = await Tour.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    res.status(200).json({
      status: 'success',
      data: updatedTour
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  // Validate request
  try {
    await Tour.destroy({
      where: { id: req.params.id }
    });

    res.status(204).json({
      status: 'success'
      // data: deletedTour
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
