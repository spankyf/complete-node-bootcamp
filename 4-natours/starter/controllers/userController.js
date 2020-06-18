const catchAsync = require('../utils/catchAsync');
const db = require('../models');

const User = db.users;

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //const query = new APIFeatures(Tour, req.query).filter().paginate().order().limitFields();
  //const tours = await query.sequelizeModel.findAll(query.queryJSON);
  const users = await User.scope('returnAll').findAll(req.query);
  //console.log(users);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  });
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
