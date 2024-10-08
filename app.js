const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reveiwsRoutes');
const globalErrorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser())
app.use(cors());


//DEvlopment Logging
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL injection
app.use(mongoSanitize());
//Data sanitization
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
app.use(express.static(`${__dirname}/public`));
// DAta sanitization against
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

//Limit request from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  message: 'To many request from IP.Please try again after few Min'
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// 3) ROUTES
app.use('/',viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server`

  next(new AppError(`Cant find ${req.originalUrl} on this server`));
  // error.statuscode = 400;
  // error.status = 'fail';

  // next(error);
  // });
});

app.use(globalErrorController);
module.exports = app;