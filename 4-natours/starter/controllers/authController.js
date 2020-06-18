const db = require('../models');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = db.users;

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({ status: 'success', token, data: { user: newUser } });
});
