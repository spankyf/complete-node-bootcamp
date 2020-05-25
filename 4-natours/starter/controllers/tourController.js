const {
  insertTour,
  selectAll
} = require('../models/tourModel');

// https://stackoverflow.com/questions/56360262/how-to-convert-json-data-into-table-and-store-into-postgres-db-using-node-js
exports.getAllTours = (req, res) => {
  // try {
  //   res.status(200).json({
  //     status: 'success',
  //     requestedAt: req.requestTime
  //   });
  // } catch (err) {}
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
};

exports.createTour = async (req, res) => {
  try {
    insertTour(req.body);
    // console.log(typeof newTour);
    selectAll();
    res.status(201).json({
      status: 'success',
      data: { tour: req.body }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    });
  }
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
