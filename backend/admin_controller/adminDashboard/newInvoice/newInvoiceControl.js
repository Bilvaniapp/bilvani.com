const Invoice = require("../../../admin_Monogdb/adminDashboard/NewInvoice/newInvoiceMongo");

// Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
      // Extract the token from cookies
      const token = req.cookies.token;
  
      // Check if token exists
      if (!token) {
        return res.status(400).json({ message: "Token is not provided in cookies" });
      }
  
      // Extract invoice data from request body
      const invoiceData = req.body;
  
      // Set default payment status to 'Pending' if not provided
      invoiceData.paymentStatus = invoiceData.paymentStatus || "Pending";
     
  
      // Store the token in the invoice data
      invoiceData.token = token;
  
      // Create a new invoice document
      const newInvoice = new Invoice(invoiceData);
  
      // Save to the database
      await newInvoice.save();
  
      // Return success response
      return res
        .status(201)
        .json({ message: "Invoice created successfully", invoice: newInvoice });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res
      .status(200)
      .json({
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch invoice by token
exports.fetchInvoiceByToken = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(400).json({ message: "Token is not provided in cookies" });
    }
    const tokenInDB = await Invoice.findOne({ token });
    // Fetch invoices associated with the token
    const invoices = await Invoice.find({ token });
    if (!tokenInDB) {
      return
    }

    // Check if invoices exist
    if (invoices.length === 0) {
      return 
    }

    // Return success response with the retrieved invoices
    return res.status(200).json({ message: "Invoices retrieved successfully", invoices });
  } catch (error) {
    console.error("Error fetching invoices by token:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(400).json({ message: "Token is not provided in cookies" });
    }

    const invoice = await Invoice.findOne({ token: token });

    // Check if a supplier with the matching token is found
    if (!invoice) {
        return 
    }

    // Fetch all invoices
    const invoices = await Invoice.find();

    return res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(400).json({ message: "Token is not provided in cookies" });
    }

    // Extract the invoice ID from the request parameters
    const invoiceId = req.params.id;

    // Validate if the ID is provided
    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    // Find the invoice in the database by ID and token
    const invoice = await Invoice.findOne({ _id: invoiceId, token });

    // Check if the invoice exists and belongs to the token
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found or unauthorized access" });
    }

    // Return the invoice data
    return res.status(200).json({ message: "Invoice fetched successfully", invoice });
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// Get invoice data by contactNo
exports.getInvoiceByContactNo = async (req, res) => {
  try {
    // Extract the contactNo from the request parameters
    const { contactNo } = req.params;

    // Check if contactNo is provided
    if (!contactNo) {
      return res.status(400).json({ message: "Contact number is required" });
    }

    // Find all invoices by contactNo and paymentStatus
    const invoices = await Invoice.find({ contactNo, paymentStatus: "Pending" });

    // Check if any invoices were found
    if (invoices.length === 0) {
      return res.status(404).json({ message: "No pending invoices found for this contact number" });
    }

    // Return the found invoices data
    return res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
