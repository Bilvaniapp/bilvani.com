const express = require('express');
const router = express.Router();
const expenseController = require('../../../admin_controller/adminDashboard/addExpense/addExpense'); // Adjust the path as needed

// Route to create a new expense
router.post('/api/bilvani/admin/create/expense', expenseController.createExpense);

// Route to get all expenses
router.get('/api/bilvani/admin/getall/expense', expenseController.getAllExpenses);

module.exports = router;
