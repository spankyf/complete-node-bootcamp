const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// the line belwo is for middleware which is between request and response
// data from request added to response
app.use(express.json());
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endmpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'))
);

console.log(tours.length);

const port = 3000;

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours }
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  res.status(200).json({
    status: 'success'
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  // Frist figure out what the id will be. Lets work it out.
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      // status 201 is created new resourse
      res.status(201).json({
        status: 'success',
        data: { tour: newTour }
      });
    }
  );
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
