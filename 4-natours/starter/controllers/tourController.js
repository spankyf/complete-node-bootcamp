const db = require('../models');
const APIFeatures = require('../utils/apiFeatures.js');

const Op = db.Op;
const Tour = db.tours;

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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
    // console.log(req.query, '   Is the original query');

    const query = new APIFeatures(Tour, req.query).filter().paginate().order().limitFields();
    // console.log(query.queryJSON);
    const tours = await query.sequelizeModel.findAll(query.queryJSON);

    console.log(typeof tours);

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

exports.getTourStats = async (req, res) => {
  try {
    const statsQuery = {
      attributes: [
        'difficulty',
        [db.sequelize.fn('COUNT', db.sequelize.col('duration')), 'numTours'],
        [db.sequelize.fn('AVG', db.sequelize.col('ratingsAverage')), 'avgRating'],
        [db.sequelize.fn('AVG', db.sequelize.col('price')), 'avgPrice'],
        [db.sequelize.fn('MIN', db.sequelize.col('price')), 'minPrice'],
        [db.sequelize.fn('MAX', db.sequelize.col('price')), 'maxPrice'],
        [db.sequelize.fn('SUM', db.sequelize.col('ratingsQuantity')), 'numRatings']
      ],
      group: ['difficulty'],
      order: [[db.sequelize.fn('AVG', db.sequelize.col('ratingsAverage')), 'ASC']]
    };

    const stats = await Tour.findAll(statsQuery);
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

//  lecture 102 idea: https://stackoverflow.com/questions/52177973/converting-postgresql-subquery-statement-into-sequelize-query

exports.getMonthlyPlan = async (req, res) => {
  try {
    // const year = req.params.year * 1;

    const plan = await db.sequelize.query('SELECT *,UNNEST("startDates") AS "unwound" FROM tours');
    console.log(plan[0]); // array of unnested rows
    console.log('                      *********************');

    res.status(200).json({
      status: 'success',
      data: plan
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
