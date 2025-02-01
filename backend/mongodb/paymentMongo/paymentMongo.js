const mongoose = require('mongoose');

const paySchema = new mongoose.Schema({
    razorpay_order_id: {
        type :String,
    },
    razorpay_payment_id: {
        type: String
    },
    razorpay_signature: {
        type: String
    }
});

module.exports= mongoose.model("Payment" , paySchema)