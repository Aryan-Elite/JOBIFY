const multer = require('multer');
const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './ResumeUploads/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserResume = upload.single('resume');

exports.postApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      throw new Error("Employer not allowed to access this resource.");
    }

    // Check if a file was uploaded
    if (!req.file) {
      throw new Error("Resume File Required!");
    }

    // File details
    const resume = req.file;

    const { name, email, coverLetter, phone, address, jobId } = req.body;

    // Check if jobId is provided
    if (!jobId) {
      throw new Error("Job not found!");
    }

    // Find job details
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      throw new Error("Job not found!");
    }

    // Get applicant and employer IDs
    const applicantID = req.user._id;
    const employerID = jobDetails.postedBy;

    if (
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address ||
      !applicantID ||
      !employerID ||
      !resume
    ) {
      throw new Error("Please fill all fields.");
    }

    // Create application
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume,
    });

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.employerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      throw new Error("Job Seeker not allowed to access this resource.");
    }
    const { _id } = req.user;
    const applications = await Application.find({ employerID: _id });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.jobseekerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      throw new Error("Employer not allowed to access this resource.");
    }
    const { _id } = req.user;
    const applications = await Application.find({ applicantID: _id });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.jobseekerDeleteApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      throw new Error("Employer not allowed to access this resource.");
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      throw new Error("Application not found!");
    }

    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
