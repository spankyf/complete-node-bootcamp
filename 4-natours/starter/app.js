const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// const userRouter = require('./routes/userRoutes');
const app = express();
// Postman collections https://www.getpostman.com/collections/777b681937a7f1001269
// 1 Middleware

app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requets from this IP, try again in an hour.'
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(process.env.NODE_ENV);
}
// body parser
app.use(express.json({ limit: '10kb' }));

// js sanization of data
app.use(xss());

// prevent parameter pollution
app.use(hpp({ whitelist: ['duration'] }));

app.use(express.static(`${__dirname}/public`));
// test middleawre
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
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
