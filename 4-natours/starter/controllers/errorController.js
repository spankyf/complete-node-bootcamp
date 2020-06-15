const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  //console.log(err);
  const message = `Invalid ${err.original} : ${err.name}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  //const errMessage = err.errors[0].message;
  //const val = err.errors[0].value;
  //console.log(err.errors[0].message);
  //console.log(value.value);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, error: err, message: err.message, stack: err.stack });
};

const sendErrorProd = (err, res) => {
  // Operational error, send info to client
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  } else {
    // Other unknown erro, dont send details
    //console.log('ERROR', err);
    res.status(500).json({ status: 'error', message: 'Somethign went very wrong' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //console.log(error);
    if (error.name === 'SequelizeDatabaseError') error = handleCastErrorDB(error);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};
