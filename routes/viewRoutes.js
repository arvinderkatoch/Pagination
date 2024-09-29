const express = require('express');
const authController = require('../controllers/authController');

const viewController = require('../controllers/viewController')
const router = express.Router();
//router.use(authController.isLoggedIn)
router.get('/',authController.isLoggedIn,viewController.getOverView)
router.get('/login',authController.isLoggedIn,viewController.tourLogin)
router.get('/tour/:slug',authController.isLoggedIn,viewController.getTour)
router.get('/me',authController.protect,viewController.getAccount)



module.exports = router;