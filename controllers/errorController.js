const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  console.log('I am in');
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, '404');
};
const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;

  const message = `Duplicate field value: ${value}, Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const error = Object.keys(err.errors).map(el => el.name);
  const message = `Invalid input data  ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = err =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpired = err => new AppError('JWT token has expired', 401);

const sendErrorProd = (err, req,res) => {
 
  if(req.originalUrl.startsWith('/api')) {
    if(err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
   
  });
  }


return res.status(500).json({
  status: 'error',
  message: 'Something went wrong'
});
}


if(err.isOperational) {
return res.status(err.statusCode).render('error',{
      title: 'Please try again later',
      msg: err.message
    
    })
  }
}

const sendErrorDev = (err, req,res) => {

  if(req.originalUrl.startsWith('/api')) {
  
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  
  });
}
  
return res.status(err.statusCode).render('error',{
      title: 'Please try again later',
      msg: err.message
    
    })
  }





module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('hello from the dev');
    sendErrorDev(err, req,res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message
    console.log('hello from the production');
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (error.name === 'TokenExpiredError') error = handleJWTExpired(err);
    sendErrorProd(error, req,res);
  }
};
