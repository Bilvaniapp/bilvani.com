const mongoose = require('mongoose');
const { types } = require('util');

const clientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India", // Default to India
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  phoneNo: {
    type: String,
 
  },
  contactNo: {
    type: String,
    
  },
  panNo: {
    type: String,
    required: true,
    unique: true,
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
  },

  password:{
    type: String,
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit'],
    required: true,
  },
  openingBalance: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [ 'A', 'B', 'C', 'D'],
    required: true,
  },

  underCategory:{
    type:String,
   
  },


  creditAllowed: {
    type: Boolean,
    required: true,
  },
  creditLimit: {
    type: Number,
    required: function () {
      return this.creditAllowed; // Only if credit is allowed
    },
  },
  token:{
    type:String
  },
  clientId:{
    type:String
  },
  otpExpiresAt: {
    type: Date
  },
  otp: {
    type: String,
  },
  remark: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Client', clientSchema);
