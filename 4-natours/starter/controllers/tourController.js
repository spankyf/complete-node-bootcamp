const bodyParser = require('body-parser');
const db = require('../models');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const Tour = db.tours;

exports.createTour = async (req, res) => {
  // Validate request
  try {
    // Create a Tutorial
    const newTour = await Tour.create(req.body);
    // console.log(newTour);
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
