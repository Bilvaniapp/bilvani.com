const mongoose = require('mongoose');

const userOrderInfo = new mongoose.Schema({
  
  customerFirstName: {
    type: String,
  },
  customerLastName: {
    type: String,
  },
  phoneNumber: {
    type: String,

  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  permanentId: {
    type: String,
    ref: 'Signup', ///// Reference to the Signup schema
  }
});

const Order = mongoose.model('userOrderInfo', userOrderInfo);

module.exports = Order;
