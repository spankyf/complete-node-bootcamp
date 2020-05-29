const db = require('../models');

const Tour = db.tours;

exports.createTour = async (req, res) => {
  // Validate request
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
  // Validate request
  try {
    const tours = await Tour.findAll();

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
