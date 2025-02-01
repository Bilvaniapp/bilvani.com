const Purchase = require('../../../admin_Monogdb/adminDashboard/addPurchase/addPurchaseMongo');

// Create a new purchase
exports.createPurchase = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Extract purchase data from request body

        const purchaseData = req.body;

        // Set default payment status to 'Pending' if not provided
        purchaseData.paymentStatus = purchaseData.paymentStatus || "Pending";

        // Store the token in the purchase data
        purchaseData.token = token;

        // Create a new purchase document
        const newPurchase = new Purchase(purchaseData);

        // Save to the database
        await newPurchase.save();

        // Return success response
        return res
            .status(201)
            .json({ message: "Purchase created successfully", purchase: newPurchase });
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



  

  // Fetch purchase by ID with token verification
exports.getPurchaseById = async (req, res) => {
  try {
      // Extract the token from cookies
      const token = req.cookies.token;

      // Check if token exists
      if (!token) {
          return res.status(400).json({ message: "Token is not provided in cookies" });
      }

      // Extract the purchase ID from the request parameters
      const purchaseId = req.params.id;

      // Validate if the ID is provided
      if (!purchaseId) {
          return res.status(400).json({ message: "Purchase ID is required" });
      }

      // Find the purchase in the database by ID and token
      const purchase = await Purchase.findOne({ _id: purchaseId, token });

      // Check if purchase exists and belongs to the token
      if (!purchase) {
          return res.status(404).json({ message: "Purchase not found or unauthorized access" });
      }

      // Return the purchase data
      return res.status(200).json({ message: "Purchase fetched successfully", purchase });
  } catch (error) {
      console.error("Error fetching purchase by ID:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

  
// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
      // Extract the token from cookies
      const token = req.cookies.token;

      // Check if token exists
      if (!token) {
          return res.status(400).json({ message: "Token is not provided in cookies" });
      }

      const purchase = await Purchase.findOne({ token: token });

      // Check if a supplier with the matching token is found
      if (!purchase) {
          return 
      }

      // Fetch all purchases
      const purchases = await Purchase.find();

      return res.status(200).json({ purchases });
  } catch (error) {
      console.error("Error fetching purchases:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




// Update a purchase by ID
exports.updatePurchaseById = async (req, res) => {
    try {
      const updatedPurchase = await Purchase.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
  
      res.status(200).json({
        message: "Purchase updated successfully",
        purchase: updatedPurchase,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };



  

  

// Delete a purchase by ID
exports.deletePurchaseById = async (req, res) => {
    try {
      const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
  
      if (!deletedPurchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
  
      res.status(200).json({ message: "Purchase deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  exports.getPurchaseByContactNo = async (req, res) => {
    try {
      // Extract the contactNo from the request parameters
      const { contactNo } = req.params;
  
      // Check if contactNo is provided
      if (!contactNo) {
        return res.status(400).json({ message: "Contact number is required" });
      }
  
      // Find all purchases by contactNo
      const purchases = await Purchase.find({ contactNo });
  
      // Check if any purchases were found
      if (purchases.length === 0) {
        return res.status(404).json({ message: "No purchases found for this contact number" });
      }
  
      // Return the found purchases data
      return res.status(200).json({ purchases });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
