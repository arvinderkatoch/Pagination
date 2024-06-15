const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(201).json({
    message: 'success',
    data: {
      reviews
    }
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReviews = await Review.create(req.body);

  res.status(202).json({
    message: 'success',
    data: {
      newReviews
    }
  });
});

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
