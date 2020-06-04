const _ = require('lodash');
const db = require('../models');

const Op = db.Op;
const Tour = db.tours;

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

function paginateQuery(query) {
  let pageNumber;
  let limitNumber;
  if (Object.keys(query.where).includes('page') || Object.keys(query.where).includes('limit')) {
    if (Object.keys(query.where).includes('page')) {
      pageNumber = query.where.page * 1;
    } else {
      pageNumber = 1;
    }
    if (Object.keys(query.where).includes('limit')) {
      limitNumber = query.where.limit * 1;
    } else {
      limitNumber = 10;
    }
    query.limit = limitNumber;
    query.offset = (pageNumber - 1) * limitNumber;
    delete query.where.page;
    delete query.where.limit;
  } else {
    console.log('no pagnation');
  }
  return query;
}

function selectFields(query) {
  let result;
  if (Object.keys(query.where).includes('fields')) {
    const wherePart = _.cloneDeep(query.where); // make a deep copy
    const sortPart = _.cloneDeep(query.order); // make a deep copy
    delete wherePart.fields;
    result = {
      attributes: query.where.fields.split(','),
      where: wherePart,
      order: sortPart
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
    const fieldFilteredQuery = selectFields(sortedQuery); // limit fields by query
    const query = paginateQuery(fieldFilteredQuery); // add pagination

    console.log(query, 'query After fields');

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
