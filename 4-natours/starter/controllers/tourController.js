const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: { tour: newTour }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Update tour here'
    }
  });
};

exports.deleteTour = (req, res) => {
  // status 204 is send a null as its deleted
  res.status(204).json({
    status: 'success',
    data: null
  });
};
