const db = require('../models');
const catchAsync = require('../utils/catchAsync');
const User = db.users;

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({ status: 'success', data: { user: newUser } });
});
