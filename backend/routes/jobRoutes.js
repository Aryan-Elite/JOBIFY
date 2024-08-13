const express = require('express');
const router = express.Router();
const jobController= require('../controllers/jobController.js');
const authController  = require('../controllers/authController.js');

router.get('/getall', jobController.getAllJobs);
router.post("/post", authController.isAuthenticated, jobController.postJob);
router.get("/getmyjobs", authController.isAuthenticated, jobController.getMyJobs);
router.put("/update/:id", authController.isAuthenticated, jobController.updateJob);
router.delete("/delete/:id", authController.isAuthenticated,jobController.deleteJob);
router.get("/:id", authController.isAuthenticated, jobController.getSingleJob);

module.exports = router;
