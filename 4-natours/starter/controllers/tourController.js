const db = require('../models');
const APIFeatures = require('../utils/apiFeatures.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Tour = db.tours;

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour: newTour }
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const query = new APIFeatures(Tour, req.query).filter().paginate().order().limitFields();
  const tours = await query.sequelizeModel.findAll(query.queryJSON);

  res.status(201).json({
    status: 'success',
    results: tours.length,
    data: tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByPk(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tour
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.update(req.body, {
    where: { id: req.params.id },
    returning: true
  });

  if (!updatedTour) {
    return next(new AppError('No tour found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedTour
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.destroy({
    where: { id: req.params.id }
  });

  if (!tour) {
    return next(new AppError('No tour found with that Id', 404));
  }

  res.status(204).json({
    status: 'success'
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

//  lecture 102 idea: https://stackoverflow.com/questions/52177973/converting-postgresql-subquery-statement-into-sequelize-query

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await db.sequelize.query('SELECT *,UNNEST("startDates") AS "unwound" FROM tours');
  console.log(plan[0]); // array of unnested rows
  console.log('                      *********************');

  res.status(200).json({
    status: 'success',
    data: plan
  });
});
