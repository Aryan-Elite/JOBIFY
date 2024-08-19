const dotenv = require('dotenv');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
dotenv.config({ path: './config.env' });
const path = require('path');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // No client can change the cookie from their browsers when they receive it
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

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error('You are not logged in! Please log in to get access.');
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error('The user belonging to this token no longer exists.');
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
});

exports.register = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    throw new Error(err.message); // Throw error to be caught by catchAsync
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new Error('Please provide email, password, and role.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid Email Or Password.');
    }

    const isPasswordMatched = await user.correctPassword(password, user.password);
    if (!isPasswordMatched) {
      throw new Error('Invalid Email Or Password.');
    }

    if (user.role !== role) {
      throw new Error(`User with provided email and role ${role} not found!`);
    }
   
    createSendToken(user, 200, res);

  } catch (err) {
    res.status(400).json({
    status:'failed',
    message: err.message,
    }) // Pass the error to the global error handler
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: 'Logged Out Successfully.',
      });
  } catch (err) {
    throw new Error(err.message); // Throw error to be caught by catchAsync
  }
});



