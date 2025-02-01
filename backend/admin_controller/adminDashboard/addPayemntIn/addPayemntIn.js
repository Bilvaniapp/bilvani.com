const PaymentIn = require('../../../admin_Monogdb/adminDashboard/addPaymentIn/addPayemntIn');
const Invoice = require('../../../admin_Monogdb/adminDashboard/NewInvoice/newInvoiceMongo');

exports.createPaymentIn = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Extract payment data from request body
        const paymentData = req.body;

        // Set default payment status to 'Pending' if not provided
        paymentData.paymentStatus = paymentData.paymentStatus || "pending";

        // Store the token in the payment data
        paymentData.token = token;

        // Create a new payment entry document
        const newPaymentIn = new PaymentIn(paymentData);

        // Save the payment entry to the database
        await newPaymentIn.save();

        // If the payment status is 'paid', update the corresponding Invoice
        if (paymentData.paymentStatus.toLowerCase() === "paid") {
            const receivedDate = new Date(); // Use provided date or current date

            // Update the Invoice document's paymentStatus to "Paid" and set the receivedDate
            await Invoice.updateOne(
                { _id: paymentData.invoiceId }, // Match the invoice by ID
                { 
                    $set: { 
                        paymentStatus: "Paid",
                        receivedDate: receivedDate 
                    } 
                }
            );
        }

        // Return success response
        return res
            .status(201)
            .json({ message: "Payment entry created successfully", payment: newPaymentIn });
    } catch (error) {
        console.error("Error creating payment entry:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




// Get all payments
exports.getAllPaymentsIn = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(400).json({ message: "Token is not provided in cookies" });
    }

    // Verify token against the database
    const tokenInDB = await PaymentIn.findOne({ token });

    if (!tokenInDB) {
      return
    }

    // Fetch all payments in
    const payments = await PaymentIn.find();

    return res.status(200).json({ payments });
  } catch (error) {


  }
};

// Update Payment Entry by ID
exports.updatePaymentIn = async (req, res) => {
  try {
    const payment = await PaymentIn.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment entry with new data
    const updatedPayment = await PaymentIn.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
  } catch (error) {
    console.error("Error updating payment entry:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete Payment Entry by ID
exports.deletePaymentIn = async (req, res) => {
  try {
    const payment = await PaymentIn.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await PaymentIn.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment entry:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// Get a specific Payment Entry by ID
exports.getPaymentInById = async (req, res) => {
  try {
    const payment = await PaymentIn.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json({ payment });
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};