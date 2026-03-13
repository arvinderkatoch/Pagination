const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')('sk_test_51Q5wHkP5oDI1SottlePYZc2qY5lba6IVk3kX6bwkOYyyTYIikA0vwuTMNK6UeGJ0jqBha2O9rkJP3THFqlDw2YUb00759d2QAE');

const Tour = require('./../models/tourModel');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourID);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                    },
                },
                quantity: 1,
            },
        ],

    });
    res.status(200).json({
        status: 'success',
        session,
    });
})
