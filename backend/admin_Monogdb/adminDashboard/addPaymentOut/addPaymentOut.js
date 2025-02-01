const mongoose = require('mongoose');

const paymentOutSchema = new mongoose.Schema({
  
  date: {
    type: Date,
    
  },
  supplierName: {
    type: String,
    
  },
  purchaseBillNo: {
    type: String,
    
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'], // You can adjust payment statuses as needed
    
  },
  amount: {
    type: Number,
    
  },
  remarks: {
    type: String,
    default: ''
  },
  token: {
    type: String,
    
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const PaymentOut = mongoose.model('PaymentOut', paymentOutSchema);

module.exports = PaymentOut;
