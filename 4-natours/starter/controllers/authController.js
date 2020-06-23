const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const db = require('../models');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const User = db.users;
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({ status: 'success', token, data: { user: user } });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // this is to protect unauth access to routes
  // 1 get token and check if it is there

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  // 2 verification token - make it a promise

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 if successful, check if user still exists - could have changed password before jwt expiration

  const freshUser = await User.findByPk(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user with this token no longer exists', 401));
  }
  // 4 check if user changed password sicne token issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password. Please login again.', 401));
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin','lead-guide']
    // get access when inside roles array
    // the req.user is received from the preceding middleware
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  const resetToken = user.createPasswordResetToken();

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Submit a PATCH request with new password and passwordConfrim to ${resetURL}. If you did not forget your password, disregard!`;
  console.log({ email: user.email, subject: 'Your password reset token for 10 mniutes', message: message });
  try {
    await sendEmail({ email: user.email, subject: 'Your password reset token for 10 mniutes', message });
    res.status(200).json({ status: 'success', message: 'token send to email' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  // 2 get user ased on this token and check that its not expired
  const user = await User.findOne({
    where: { passwordResetToken: hashedToken, passwordResetTokenExpires: { [db.Op.gte]: Date.now() } }
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetTokenExpires = null;
  //user.clearTokenInfo();
  await user.save();
  //console.log(user);
  // 3 login user
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  //console.log(user);
  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return new AppError('Your current password is wrong. Try again to enter it. ', 401);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
