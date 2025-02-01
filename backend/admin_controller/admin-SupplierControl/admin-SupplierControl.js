const Supplier = require("../../admin_Monogdb/admin-SupplierMongo/admin-SupplierMongo");

// Create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Extract supplier data from request body
        const supplierData = req.body;

        // Store the token in the supplier data
        supplierData.token = token;

        // Create a new supplier document
        const newSupplier = new Supplier(supplierData);

        // Save to the database
        await newSupplier.save();

        // Return success response
        return res
            .status(201)
            .json({ message: "Supplier created successfully", supplier: newSupplier });
    } catch (error) {
        console.error("Error creating supplier:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!deletedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Fetch the supplier from the database (assuming supplierToken is stored in the Supplier model)
        const supplier = await Supplier.findOne({ token: token });

        // Check if a supplier with the matching token is found
        if (!supplier) {
            return 
        }

        // Fetch all suppliers (assuming you're authorized to do so)
        const suppliers = await Supplier.find();
        res.status(200).json({ suppliers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get a single supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ supplier });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};