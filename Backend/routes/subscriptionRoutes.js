// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const { subscribeToTopic, unsubscribeFromTopic } = require("../controllers/subscriptionController");
const authController = require("../controllers/authController"); // Assuming you have authentication

// Protect routes to ensure only authenticated users can subscribe/unsubscribe
router.post(
  "/subscribe",
  authController.isAuthenticated, // Middleware to protect the route
  subscribeToTopic
);

router.post(
  "/unsubscribe",
  authController.isAuthenticated, // Middleware to protect the route
  unsubscribeFromTopic
);

module.exports = router;
