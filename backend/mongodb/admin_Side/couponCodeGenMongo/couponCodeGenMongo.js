const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  couponCode: {
    type: String,
    unique: true,
  },
  expiryTime: {
    type: Date,
  },
  percentage: {
    type: Number,
    min: 0,
  },
  createTime: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  isOneTimeUse: {
    type: Boolean,
    default: false, // Indicates if the coupon is one-time use
  },
  usedBy: [
    {
      type: String, // Assuming permanentId is a string
      ref: 'Signup',
    },
  ],
  
  isUsed: {
    type: Boolean,
    default: false, // Indicates if the coupon has been used
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
