const mongoose = require('mongoose');
const { type } = require('os');
const { types } = require('util');

const adminsignupSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  category:{
    type:String
  },
  otpExpiresAt: {
    type: Date
  },
  otp: {
    type: String,
  },
  storeAddress:{type: String},
  verified: {
    type: Boolean,
    default: false,
  }
});

const adminSignup = mongoose.model('AdminSignup', adminsignupSchema);

module.exports = adminSignup;
