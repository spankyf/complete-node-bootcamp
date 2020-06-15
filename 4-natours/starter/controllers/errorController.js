const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  //console.log(err);
  const message = `Invalid ${err.original} : ${err.name}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errors[0];
  //console.log(err.errors[0].message);
  //console.log(value.value);
  const message = `Duplicate fields for ${value.value} . Use another value`;
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
    console.log('ERROR', err);
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

    if (error.name === 'SequelizeDatabaseError') error = handleCastErrorDB(error);
    if (error.name === 'SequelizeValidationError') error = handleDuplicateFieldsDB(error);
    //if (error.errors[0].message.name === 'Invalid validator function: 1') error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};
