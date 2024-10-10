const catchAsync = require('../utils/catchAsync.js');
const Job = require('../models/jobModel.js');
const User = require('../models/userModel.js'); // Import User model
const { applyFilters } = require('../utils/searchFilters.js'); // Adjust the path as needed
const snsClient = require('../config/awsConfig.js'); // Import SNS client
const { PublishCommand } = require('@aws-sdk/client-sns');

// Function to match job with users
const matchJobWithUsers = async (job) => {
    // Fetch job seekers from your database
    const jobSeekers = await User.find({ role: 'Job Seeker' });

    // Filter job seekers whose skillset matches with any of the job's required skills
    const matchedUsers = jobSeekers.filter(seeker =>
        seeker.skillset.some(skill => job.skillsRequired.includes(skill))
    );

    return matchedUsers;
};


// Function to publish SNS notification
const publishJobNotification = async (message) => {
  const params = {
    Message: JSON.stringify({
      default: message,
      email: message,
      sms: message,
      application: message,
    }),
    TopicArn: process.env.SNS_TOPIC_ARN,
    MessageStructure: "json",
  };

  const command = new PublishCommand(params);

  try {
    const data = await snsClient.send(command);
    console.log("Notification sent:", data.MessageId);
  } catch (error) {
    console.error("Error publishing notification:", error);
  }
};

// Controller functions
exports.searchJobs = catchAsync(async (req, res, next) => {
  let query = Job.find(); // Start with a base query
  query = await applyFilters(query, req.query); // Apply filters

  const jobs = await query; // Execute the query
  res.status(200).json({
    success: true,
    results: jobs.length,
    jobs,
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

exports.postJob = catchAsync(async (req, res, next) => {
    try {
      const {
        company,
        title,
        description,
        category,
        skillsRequired,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        experienceLevel,
      } = req.body;
  
      // Create the job
      const job = await Job.create({
        company,
        title,
        description,
        category,
        skillsRequired,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        experienceLevel,
        postedBy: req.user._id, // Assuming req.user contains the logged-in user information
      });
  
      // Match users
      const matchedUsers = await matchJobWithUsers(job);
  
      if (matchedUsers.length > 0) {
        const message = `A new job "${job.title}" at "${job.company}" matches your skills! Check it out on Jobify.`;
        await publishJobNotification(message);
      }
  
      res.status(201).json({
        status: "Job Posted Successfully",
        data: {
          job,
        },
      });
    } catch (error) {
      next(error);
    }
  });
  

exports.getMyJobs = catchAsync(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    throw new Error('Job Seeker not allowed to access this resource.');
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
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

exports.deleteJob = catchAsync(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
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
