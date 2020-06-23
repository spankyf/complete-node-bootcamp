const catchAsync = require('../utils/catchAsync');
const db = require('../models');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  //console.log(obj);
  //console.log(newObject);
  return newObject;
};

const User = db.users;

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.scope('returnAll').findAll(req.query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 create error if users posts paswwrod data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update, please use updateMyPassword', 400));
  }

  // 2 if not update user row. Only allow certain fields to be changed
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.update(filteredBody, { where: { id: req.user.id }, returning: true });
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const inactiveUser = await User.update({ active: false }, { where: { id: req.user.id } });
  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined'
  });
};
