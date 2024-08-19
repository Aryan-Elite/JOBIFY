const express = require('express');
const router = express.Router();
const jobController= require('../controllers/jobController.js');
const authController  = require('../controllers/authController.js');

router.get('/searchByPay', jobController.searchByPay);
router.get('/searchByTitle', jobController.searchByTitle);
router.get('/getall', jobController.getAllJobs);
router.get('/searchJobs', jobController.searchJobs);
router.post("/post", authController.isAuthenticated, jobController.postJob);
router.get("/getmyjobs", authController.isAuthenticated, jobController.getMyJobs);
router.patch("/update/:id", authController.isAuthenticated, jobController.updateJob);
router.delete("/delete/:id", authController.isAuthenticated,jobController.deleteJob);
router.get("/:id", authController.isAuthenticated, jobController.getSingleJob);

module.exports = router;
