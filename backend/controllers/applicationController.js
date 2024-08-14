const multer = require('multer');
const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');
const nodemailer = require('nodemailer');
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


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER, // Store your email in environment variable
        pass: process.env.EMAIL_PASS, // Store your app password in environment variable
      },
    });
    
    const mailOptions = {
      from: `"${jobDetails.company}" <${process.env.EMAIL_USER}>`, // Correct format for displaying the company name
      to: email, // list of receivers
      subject: `Application Confirmation for ${jobDetails.title}`,
      
      text: `Dear ${name},\n\nThank you for applying for the ${jobDetails.title} position at ${jobDetails.company}.\n\nJob Details:\nTitle: ${jobDetails.title}\nDescription: ${jobDetails.description}\nLocation: ${jobDetails.location}\n\nWe have received your application and will review it shortly. You will be contacted soon if you are shortlisted.\n\nBest regards,\n${jobDetails.companyName}`,

      html: `<p>Dear ${name},</p><p>Thank you for applying for the <strong>${jobDetails.title}</strong> position at ${jobDetails.company}.</p><p><strong>Job Details:</strong><br/>Title: ${jobDetails.title}<br/>Description: ${jobDetails.description}<br/>Location: ${jobDetails.location}</p><p>We have received your application and will review it shortly. You will be contacted soon if you are shortlisted.</p><p>Best regards,<br/>${jobDetails.company}</p>`,
      
      // attachments: [
      //   {
      //     filename: "test.png",
      //     path:'./test.png',
      //     contentType: "image/png"
      //   }
      // ], // attachments
    };
    // Send the email
    await transporter.sendMail(mailOptions);
   console.log(jobDetails);
   
    res.status(200).json({
      success: true,
      message: "Application Submitted and Email Sent!",
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
