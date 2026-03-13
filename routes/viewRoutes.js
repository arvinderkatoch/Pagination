const express = require('express');
const authController = require('../controllers/authController');

const viewController = require('../controllers/viewController')
const router = express.Router();
router.use(authController.isLoggedIn)
router.get('/', viewController.getOverView)
router.get('/login', viewController.tourLogin)
router.get('/signup', viewController.tourSignup)
router.get('/me', authController.protect, viewController.me)
router.get('/tour/:slug', viewController.getTour)



module.exports = router;