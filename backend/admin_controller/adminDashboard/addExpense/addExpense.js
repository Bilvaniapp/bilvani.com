const Expense = require('../../../admin_Monogdb/adminDashboard/addExpense/addExpense'); // Adjust the path as needed

exports.createExpense = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Extract expense data from request body
        const expenseData = req.body;

        // Find the document with the given token
        let expenseDocument = await Expense.findOne({ token });

        if (!expenseDocument) {
            // If no document exists, create a new one with the token
            expenseDocument = new Expense({ token, expenses: [] });
        }

        // Add the new expense to the expenses array
        expenseDocument.expenses.push(expenseData);

        // Save the document
        await expenseDocument.save();

        return res.status(201).json({ message: "Expense added successfully", expense: expenseDocument });
    } catch (error) {
        console.error("Error creating expense:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Controller to get all expenses
exports.getAllExpenses = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Find the document with the given token
        const expenseDocument = await Expense.findOne({ token });

        // If no document is found, return an error response
        if (!expenseDocument) {
            return 
        }

        // Return the expenses array from the found document
        return res.status(200).json({ expenses: expenseDocument.expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


