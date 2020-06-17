const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const userRouter = require('./routes/userRoutes');
const app = express();
// Postman collections https://www.getpostman.com/collections/777b681937a7f1001269
// 1 Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// undhandled route handler - all is for all http methods
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`));
});

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({ status: err.status, message: err.message });
// });

app.use(globalErrorHandler);

module.exports = app;
