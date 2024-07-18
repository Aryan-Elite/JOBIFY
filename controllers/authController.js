const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


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
      httpOnly: true, // no any client can change the cookie  from their browsers when they receive it
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
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
});



exports.register = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
    });
  console.log(req.body);
    createSendToken(newUser, 201, res);
  });



exports.login = catchAsync(async(req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new AppError("Please provide email ,password and role."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid Email Or Password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password,user.password);
    if (!isPasswordMatched) {
      return next(new AppError("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
      return next(
        new AppError(`User with provided email and ${role} not found!`, 404)
      );
    }

    createSendToken(user, 200, res);
  });
  
exports.logout= catchAsync(async (req, res, next) => {
  res
    .status(200)
    .cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});