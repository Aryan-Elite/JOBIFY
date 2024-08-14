const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController= require('../controllers/authController')

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);


router.get("/logout", authController.isAuthenticated,authController.logout);
router.get("/getuser", authController.isAuthenticated,userController.getUser);

module.exports = router;
