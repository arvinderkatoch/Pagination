const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');

//  exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);
//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_In
//   });

//   return res.status(201).json({
//     status: 'Success',
//     token,s
//     user: newUser
//   });
// });

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_In
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
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

  // 3) if everything ok send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('I am here');
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

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
  //in sign function we are encoding id
  //Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User doesnt exist', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, Please Log in again', 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have the permission to perform action', 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // 1) Get user based on posted email
  if (!user) {
    return next(new AppError('There is not user with email address'));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3 Send t to users email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}}/api/v1//resetPassword/${resetToken}`;
  const message = `Forgot your password ? Submit a PATCH request with your new pasword and passwordConfirm to : ${resetURL}.\ If yo didnt forget password please ignore this mail`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Validation for 10 min)',
      message
    });
    res.status(200).json({
      status: 'message',
      messsage: 'Token sent to mail'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(err), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  console.log(req.body.password);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(req.body.password);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //2) if token has not expired and there  is user set the new password

  if (!user) {
    return next(new AppError('This token is invalid or has expired', 400));
  }
  console.log(req.body.password);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) Update changePasswordAt property for the user

  // 4) Log the user in send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //2 Check if posted user is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByID and Update will not work as intented

  createSendToken(user, 200, res);
  //4) Log user
});
