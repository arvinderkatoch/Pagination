const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);
//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_In
//   });

//   return res.status(201).json({
//     status: 'Success',
//     token,
//     user: newUser
//   });
// });

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_In
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!email || !password) {
    const error = new AppError('Please provide email and password', 400);
    return next(error);
  }
  //check if username exist and pass is correct

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  return res.status(200).json({
    message: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in , Please log in to get acess', 401)
    );
  }

  //verify tokens
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  //decodede will contain id
  //Check if user still exists
  //in sign function we are encoding id
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('User doesnt exist', 401));
  }
  console.log(decoded);
  next();
});
