const mongoose = require('mongoose');

const paymentInSchema = new mongoose.Schema({
  contactNo: {
    type: String,
    
  },
  customerName: {
    type: String,
   
  },
  date: {
    type: Date,
    default: Date.now,
  },
  invoiceNo: {
    type: String,
    
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    
  },
  amount: {
    type: Number,
    
  },
  remarks: {
    type: String,
    default: '',
  },
  token: {
    type: String,
   
  },
});

const PaymentIn = mongoose.model('PaymentIn', paymentInSchema);

module.exports = PaymentIn;
