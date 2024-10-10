const express =require("express");
const router = express.Router();
const authController=require("../controllers/authController");
const applicationController = require("../controllers/applicationController");

router.post("/post", authController.isAuthenticated,applicationController.uploadUserResume,applicationController.postApplication);

router.get("/employer/getall", authController.isAuthenticated,applicationController.employerGetAllApplications);   //Get all the applications  of user on the posted Jobs

router.get("/jobseeker/getall", authController.isAuthenticated,applicationController.jobseekerGetAllApplications);
router.delete("/delete/:id", authController.isAuthenticated, applicationController.jobseekerDeleteApplication);

module.exports=router;