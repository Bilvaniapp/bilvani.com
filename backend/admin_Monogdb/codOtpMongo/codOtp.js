const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // permanentId from cookies
    otp: { type: String, required: true },   // Generated OTP
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes
});

module.exports = mongoose.model('CodOtp', OtpSchema);
