const express = require('express');
const authController = require('../controllers/authController');

const viewController = require('../controllers/viewController')
const router = express.Router();
router.use(authController.isLoggedIn)
router.get('/',viewController.getOverView)
router.get('/login',viewController.tourLogin)
router.get('/tour/:slug',viewController.getTour)



module.exports = router;