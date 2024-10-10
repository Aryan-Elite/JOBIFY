const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'A job must have a company name.'],
  },
  title: {
    type: String,
    required: [true, 'A job must have a title.'],
  },
  description: {
    type: String,
    required: [true, 'A job must have a description.'],
  },
  skillsRequired: {
    type: [String], // Array of strings for multiple skills
    required: false,
},
  category: {
    type: String,
    required: [true, 'A job must have a category.'],
  },
  country: {
    type: String,
    required: [true, 'A job must have a country.'],
  },
  city: {
    type: String,
    required: [true, 'A job must have a city.'],
  },
  location: {
    type: String,
    required: [true, 'A job must have a location.'],
  },
  fixedSalary: {
    type: Number,
    required: false,
  },
  salaryFrom: {
    type: Number,
    required: false,
  },
  salaryTo: {
    type: Number,
    required: false,
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level'],
    required: [true, 'A job must have an experience level.'],
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A job must be posted by a user.'],
  },
  expired: {
    type: Boolean,
    default: false,
  },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
