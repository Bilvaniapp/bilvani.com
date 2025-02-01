const mongoose = require('mongoose');

// Define the schema for an individual expense entry
const individualExpenseSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    expenseType: {
        type: String,
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'cheque', 'cardPayment', 'mobileWallet', 'demandDraft', 'bankTransfer'],
    },
    paidBy: {
        type: String,
    },
    remarks: {
        type: String,
    },
}, { _id: false }); // Disable _id for subdocuments

// Define the schema for the token with an array of expenses
const expenseSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true, // Enforce uniqueness
    },
    expenses: [individualExpenseSchema], // Embed expenses as an array
}, {
    timestamps: true,
});

// Create the Expense model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
