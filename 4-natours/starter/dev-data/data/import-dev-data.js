const fs = require('fs');
const db = require('../../models');

const Tour = db.tours;

const tours = JSON.parse(
  fs.readFileSync('tours-simple.json')
);

const createTour = async (req, res) => {
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
