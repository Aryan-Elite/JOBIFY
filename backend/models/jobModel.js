const mongoose = require("mongoose");
const User = require('./userModel');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please provide Company Name."],
  },
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide description."],
    minLength: [30, "Description must contain at least 30 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [20, "Location must contain at least 20 characters!"],
  },
  fixedSalary: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"],
    max: [999999999, "Salary cannot exceed 9 digits"],
  },
  salaryFrom: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"],
    max: [999999999, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"],
    max: [999999999, "Salary cannot exceed 9 digits"],
    validate: {
      validator: function(value) {
        // `this` refers to the current document
        return value >= this.salaryFrom;
      },
      message: "Salary To must be greater than or equal to Salary From"
    }
  },
  expired: {
    type: Boolean,
    default: false,
  },
  experienceLevel: {
    type: String,  // Add this to define the type
    enum: ["entry", "mid", "senior"],
    required: [true, "Please provide experienceLevel."],
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User schema
    required: true,
  },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
