const catchAsync = require('../utils/catchAsync.js');
const Job = require('../models/jobModel.js');
const User = require('../models/userModel.js');
const { applyFilters } = require('../utils/searchFilters.js');
const { publishJobNotification } = require('../utils/notificationService.js'); // Import notification service

// Helper function: Match job with users based on skills
const matchJobWithUsers = async (job) => {
  const jobSeekers = await User.find({ 
    role: 'Job Seeker', 
    skillset: { $in: job.skillsRequired } 
  }).select('email'); // Only fetch emails

  return jobSeekers.map((seeker) => seeker.email);
};

// Controller functions

// Search jobs with filters applied
exports.searchJobs = catchAsync(async (req, res, next) => {
  let query = Job.find();
  query = await applyFilters(query, req.query);
  const jobs = await query;

  res.status(200).json({
    success: true,
    results: jobs.length,
    jobs,
  });
});

// Get all active (non-expired) jobs
exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

// Post a new job and notify matched users
exports.postJob = catchAsync(async (req, res, next) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user._id,
  });

  const matchedUserEmails = await matchJobWithUsers(job);

  if (matchedUserEmails.length > 0) {
    const message = `A new job "${job.title}" at "${job.company}" matches your skills! Check it out on Jobify.`;
    await publishJobNotification(message, matchedUserEmails, 'New Job Alert');
  }

  res.status(201).json({
    status: 'Job Posted Successfully',
    data: { job },
  });
});

// Get jobs posted by the current user
exports.getMyJobs = catchAsync(async (req, res, next) => {
  if (req.user.role === 'Job Seeker') {
    throw new Error('Job Seeker not allowed to access this resource.');
  }
  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    myJobs,
  });
});

// Update a job by its ID
exports.updateJob = catchAsync(async (req, res, next) => {
  if (req.user.role === 'Job Seeker') {
    throw new Error('Job Seeker not allowed to access this resource.');
  }

  const { id } = req.params;
  let job = await Job.findById(id);

  if (!job) {
    throw new Error('OOPS! Job not found.');
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Job Updated!',
    job,
  });
});

// Delete a job by its ID
exports.deleteJob = catchAsync(async (req, res, next) => {
  if (req.user.role === 'Job Seeker') {
    throw new Error('Job Seeker not allowed to access this resource.');
  }

  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    throw new Error('OOPS! Job not found.');
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job Deleted!',
  });
});

// Get a single job by its ID
exports.getSingleJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    throw new Error('Job not found.');
  }

  res.status(200).json({
    success: true,
    job,
  });
});
