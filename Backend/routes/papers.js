const express =require("express");
const router = express.Router();
const papersController=require("../controllers/papersController");
// const applicationController = require("../controllers/applicationController");
router.get("/Accenture/papers",papersController.scrapeAndSavePapers);   //Get all the applications  of user on the posted Jobs

module.exports=router;