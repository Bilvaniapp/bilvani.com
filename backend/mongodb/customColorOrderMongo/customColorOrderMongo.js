const mongoose = require('mongoose');

// Define the OrderConfirmed schema
const customColorOrder = new mongoose.Schema({
    products: [
        {
            name: {
                type: String,
                
            },
            Price: {
                type: Number,
               
            },
           
            
            base:{
                type: String,
            },
            fragnance:{
                type :String
            },
            colorHex: { 
                type: String,
            }
        }
    ],
    amount: {
        type: Number,
    },
    address: {
        type: String,
    },
    razorpay_order_id: {
        type: String,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    customerFirstName: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    phoneNumber:{
        type:String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    orderId: { // Custom identifier field
        type: String,
     
    },
    permanentId: { // Field for permanent ID
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    quantity: {
        type: String,
    }
});

module.exports = mongoose.model('customcolororder', customColorOrder);
