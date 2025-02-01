const mongoose = require('mongoose');

// Define the CancelOrder schema
const cancelOrderSchema = new mongoose.Schema({
    // Reference to the original order
    originalOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderConfirmed',
        required: true
    },
    // Reason for cancellation
    reason: {
        type: String,
        required: true
    },
    // Additional details related to cancellation
    additionalDetails: {
        type: String
    },
    // Timestamp for cancellation
    cancelledAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CancelOrder', cancelOrderSchema);
