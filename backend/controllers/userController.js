const User=require('../models/userModel.js');
const catchAsync=require('../utils/catchAsync.js');

exports.getUser = catchAsync((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });