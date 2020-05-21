const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      'dev-data',
      'data',
      'tours-simple.json'
    )
  )
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    path.join(
      __dirname,
      'dev-data',
      'data',
      'tours-simple.json'
    ),
    JSON.stringify(tours),
    (err) => {
      // status 201 is created new resourse
      res.status(201).json({
        status: 'success',
        data: { tour: newTour }
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Update tour here'
    }
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid ID' });
  }
  // status 204 is send a null as its deleted
  res.status(204).json({
    status: 'success',
    data: null
  });
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});