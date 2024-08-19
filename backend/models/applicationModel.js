const mongoose = require("mongoose");
const validator = require("validator");

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  resume: {
    type: {
      filename: String, // The filename of the uploaded resume
      path: String,     // The path to the uploaded resume
    },
    default: {
      filename: "resume.jpg",
      path: "./ResumeUploads/resume.jpg",
    },
  },
  applicantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
