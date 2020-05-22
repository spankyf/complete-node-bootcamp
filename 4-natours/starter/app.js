// const fs = require('fs');
// const path = require('path');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Postman collections https://www.getpostman.com/collections/777b681937a7f1001269
// 1 Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', tourRouter);

module.exports = app;
