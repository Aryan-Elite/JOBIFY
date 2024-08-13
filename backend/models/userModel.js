const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const  jwt =require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please enter your Name!"],
      minLength: [3, "Name must contain at least 3 Characters!"],
      maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your Email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    phone: {
      type: Number,
      required: [true, "Please enter your Phone Number!"],
    },
    password: {
      type: String,
      required: [true, "Please provide a Password!"],
      minLength: [8, "Password must contain at least 8 characters!"],
      maxLength: [32, "Password cannot exceed 32 characters!"],
      select: false,
    },
    // passwordConfirm: {
    //     type: String,
    //     required: [true, 'Please confirm your password'],
    //     validate: {
    //       // This  only works CREATE and SAVE
    //       validator: function (el) {
    //         return el === this.password;
    //       },
    //       message: 'Passwords do not match',
    //     },
    //   },
    role: {
      type: String,
      required: [true, "Please select a role"],
      enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  });

//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12 (according to efficiency of CPU)
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    // this.passwordConfirm = undefined;
    next();
  });

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

const User = mongoose.model('User', userSchema);

module.exports = User;
