// Import Mongoose
const mongoose = require('mongoose');

// Define the Purchase Schema
const purchaseSchema = new mongoose.Schema({
    purchaseType: {
        type: String,
        required: true,
        enum: ['gst', 'non-gst']
    },
    
    purchaseDate: {
        type: Date,
        required: true
    },
    supplierName: {
        type: String,
        required: true
    },
    placeOfSupply: {
        type: String,
        required: true
    },
    purchaseBillNo: {
        type: String,
        required: true,
        unique: true
    },
    purchaseOrderNo: {
        type: String
    },
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    purchasePrice: {
        type: Number,
        required: true,
      
    },
    gst: {
        type: Number,
        required: true,
    
    },
    amount: {
        type: Number,
       
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    token:{
        type:String
    },
    
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the Purchase model
const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
