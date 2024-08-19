const catchAsync = require('../utils/catchAsync.js');
const Job = require('../models/jobModel.js');

const { applyFilters } = require('../utils/searchFilters.js'); // Adjust the path as needed

exports.searchJobs = async (req, res, next) => {
    try {
        let query = Job.find(); // Start with a base query
        
        query = await applyFilters(query, req.query); // Apply filters

        const jobs = await query; // Execute the query
        res.status(200).json({
            success: true,
            results: jobs.length,
            jobs,
        });
    } catch (err) {
        next(err); // Pass errors to error handling middleware
    }
};

exports.getAllJobs = catchAsync(async (req, res, next) => {
  try {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.postJob = catchAsync(async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      throw new Error('Job Seeker not allowed to access this resource.');
    }
    const {
      company,
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      experienceLevel
    } = req.body;

    if (!company || !title || !description || !category || !country || !city || !location || !experienceLevel) {
      throw new Error('Please provide full job details.');
    }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
      throw new Error('Please either provide fixed salary or ranged salary.');
    }

    if (salaryFrom && salaryTo && fixedSalary) {
      throw new Error('Cannot Enter Fixed and Ranged Salary together.');
    }

    const postedBy = req.user._id;
    const job = await Job.create({
      company,
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      experienceLevel,
      postedBy,
    });

    res.status(200).json({
      success: true,
      message: 'Job Posted Successfully!',
      job,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

exports.getMyJobs = catchAsync(async (req, res, next) => {
  try {
    const { role } = req.user.role;
    if (role === "Job Seeker") {
      throw new Error('Job Seeker not allowed to access this resource.');
    }
    const myJobs = await Job.find({ postedBy: req.user._id });
    // console.log(myJobs.length());
    res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.updateJob = catchAsync(async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.getSingleJob = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      throw new Error('Job not found.');
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID / CastError',
    });
  }
});


exports.searchByPay = catchAsync(async (req, res, next) => {
  try {
    // Parse the pay parameter from the query string
    const minPay = parseInt(req.query.pay, 10);

    // Check if the pay parameter is a valid number
    if (isNaN(minPay)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid pay parameter.',
      });
    }

    // Construct the query
    const jobs = await Job.find({
      $or: [
        { fixedSalary: { $gte: minPay } },
        {
          salaryFrom: { $lte: minPay },
          salaryTo: { $gte: minPay }
        }
      ]
    });

    res.status(200).json({
      success: true,
      results: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

exports.searchByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;

    // Check if title is provided
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title to search for.',
      });
    }

    // Find jobs where the title matches the provided query parameter
    const jobs = await Job.find({
      title: new RegExp(title, 'i'), // Case-insensitive search
    });

    res.status(200).json({
      success: true,
      results: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


exports.searchByDate = catchAsync(async (req, res, next) => {
  try {
    // Parse the datePosted parameter from the query string
    const { datePosted } = req.query;

    // Check if datePosted is provided
    if (!datePosted) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a datePosted parameter.',
      });
    }
    // Convert the datePosted parameter into a number of days
    const daysAgo = parseInt(datePosted, 10);
    if (isNaN(daysAgo) || daysAgo < 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid datePosted parameter.',
      });
    }

    // Calculate the date to filter from
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    // Construct the query to find jobs posted on or after the calculated date
    const jobs = await Job.find({
      jobPostedOn: { $gte: date },
      expired: false, // Ensure that the job is not expired
    });

    res.status(200).json({
      success: true,
      results: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});
