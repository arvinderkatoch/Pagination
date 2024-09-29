const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverView = catchAsync(async (req,res) => {
  // Get data from collection
  const tours = await Tour.find();
  // build template
  // Render that template using tour data from 1
    res.status(200).render('overview',{
     tours
    });
  })

  exports.getTour = catchAsync(async(req,res,next) => {

    const tour = await Tour.findOne({slug:req.params.slug}).populate({
      path: 'review',
      fields: 'review rating'
    });

    if (!tour) {
      return next(new AppError("There is no tour with that name", 404));
    }
    res.status(200).render('tour',{
      title: tour.name,
     tour
    })
  });
  exports.tourLogin = catchAsync(async(req,res) => {
    res.status(200).render('login',{
      title: 'Login to your account'
     });
   });

   exports.getAccount = (req,res) => {
    res.status(200).render('account',{
      title: 'Your account'
    })
   }