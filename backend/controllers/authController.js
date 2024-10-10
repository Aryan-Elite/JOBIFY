// controllers/authController.js
const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const speakeasy = require('speakeasy');

dotenv.config({ path: './config.env' });

// Function to sign a JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to create and send a JWT token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side scripts from accessing the cookie
  };
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // Remove password from the output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Middleware to check if a user is authenticated
exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'You are not logged in! Please log in to get access.' });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res
      .status(401)
      .json({ message: 'The user belonging to this token no longer exists.' });
  }

  req.user = currentUser;
  next();
});

// User registration
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, role, skillset } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide all required fields.',
    });
  }

  if (role === 'Employer' && skillset && skillset.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Employers should not provide a skillset.',
    });
  }

  const newUser = await User.create({
    name,
    email,
    phone,
    password,
    role,
    skillset: role !== 'Employer' ? skillset : undefined,
    temp_secret: speakeasy.generateSecret(), // Generate temp_secret for 2FA setup
  });

  res.status(201).json({
    status: 'success',
    message: 'Registration successful. Please verify 2FA.',
    data: {
      user: newUser,
    }
  });
});


// User login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Please provide email, password, and role.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid Email Or Password.' });
  }

  if (user.role !== role) {
    return res.status(401).json({ message: `User with provided email and role ${role} not found!` });
  }

  // If user has set up 2FA, prompt for 2FA verification
  if (user.secret) {
    res.status(200).json({
      status: 'success',
      message: 'Please validate 2FA',
      data: { userId: user._id } // Send userId to frontend to validate 2FA later
    });
  } else {
    // If user doesn't have 2FA, skip and authenticate
    createSendToken(user, 200, res);
  }
});

// User logout
exports.logout = catchAsync(async (req, res, next) => {
  res.status(200)
    .cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      status: 'success',
      message: 'Logged Out Successfully.',
    });
});

// Verify 2FA setup
exports.verify2fa = catchAsync(async (req, res, next) => {
  const { token: twoFAToken } = req.body;
  const userId = req.body.userId;  // Get userId from request

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.temp_secret.base32,
    encoding: 'base32',
    token: twoFAToken,
    window: 1, // Allow a window of 1 step before and after
  });

  if (verified) {
    // Move temp_secret to permanent secret
    await User.updateOne({ _id: userId }, { 
      $set: { secret: user.temp_secret }, 
      $unset: { temp_secret: "" } 
    });

    // Send the JWT after successful 2FA
    createSendToken(user, 200, res);
  } else {
    res.status(400).json({ message: 'Invalid 2FA code' });
  }
});

// Validate 2FA token during login
exports.validate2fa = catchAsync(async (req, res, next) => {
  const { token: twoFAToken, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.secret.base32,
    encoding: 'base32',
    token: twoFAToken,
    window: 1, 
  });

  if (verified) {
    // Send JWT after successful 2FA
    createSendToken(user, 200, res);
  } else {
    res.status(400).json({ message: 'Invalid 2FA code' });
  }
});
