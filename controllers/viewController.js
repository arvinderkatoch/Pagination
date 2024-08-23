const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.getOverView = catchAsync (async (req,res) => {
  // Get data from collection
  const tours = await Tour.find();
  // build template
  // Render that template using tour data from 1
    res.status(200).render('overview',{
     tours
    });
  })

  exports.getTour = catchAsync(async(req,res) => {

    const tour = await Tour.findOne({slug:req.params.slug}).populate({
      path: 'reviews',
      fields: 'review rating'
    })
    res.status(200).render('tour',{
     tour
    })
  });
  