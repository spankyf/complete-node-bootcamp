const _ = require('lodash');
const db = require('../models');

const Op = db.Op;
const Tour = db.tours;

function selectFields(query) {
  let result;
  if (Object.keys(query.where).includes('fields')) {
    const wherePart = _.cloneDeep(query.where); // make a deep copy
    const sortPart = _.cloneDeep(query.sort); // make a deep copy
    delete wherePart.fields;
    result = {
      attributes: query.where.fields.split(','),
      where: wherePart,
      sort: sortPart
    };
  } else {
    result = query;
  }
  return result;
}

function sortQuery(query) {
  let result;
  const wherePart = _.cloneDeep(query.where); // make a deep copy
  if (Object.keys(query.where).includes('sort')) {
    delete wherePart.sort;
    result = {
      order: query.where.sort
        .split(',')
        .map((str) => (str.charAt(0) === '-' ? [str.substring(1), 'DESC'] : [str, 'ASC'])),
      where: wherePart
    };
  } else {
    result = {
      order: [['price', 'DESC']],
      where: wherePart
    };
  }
  return result;
}

function advancedQuery(query) {
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
        break;
    }
  }
  return { where: query };
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

    const filteredQuery = advancedQuery(req.query); // advanced filtering
    const sortedQuery = sortQuery(filteredQuery); // sort function
    const query = selectFields(sortedQuery);
    console.log(query, 'query up to now');

    const tours = await Tour.findAll(query);

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
