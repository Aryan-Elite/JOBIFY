const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController= require('../controllers/authController')

// Public routes
router.post('/register', authController.register);
router.post('/verify-2fa', authController.verify2fa);  //just after registration route
router.post('/login', authController.login);
router.post('/validate-2fa', authController.validate2fa);  //just after login route
router.get("/logout", authController.isAuthenticated,authController.logout);
router.get("/getuser", authController.isAuthenticated,userController.getUser);

module.exports = router;
