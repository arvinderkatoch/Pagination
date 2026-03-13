const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

//router.use(authController.protect);

router.get('/checkout-session/:tourID', authController.protect, bookingController.getCheckoutSession);

module.exports = router;
