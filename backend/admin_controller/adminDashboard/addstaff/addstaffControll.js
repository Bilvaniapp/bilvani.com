const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT for decoding the token
const Staff = require("../../../admin_Monogdb/adminDashboard/addstaff/addstaffMongo");

// Create a new staff member
exports.createStaff = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        // Decode the token to extract the role
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace 'process.env.JWT_SECRET' with your actual secret key
        } catch (error) {
            return res.status(401).json({ message: "Invalid token", error: error.message });
        }

        const role = decodedToken.role; // Extract the role field

        if (!role) {
            return res.status(400).json({ message: "Role is not found in the token" });
        }

        // Extract staff data from request body
        const staffData = req.body;

        // Hash the password
        if (!staffData.password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(staffData.password, saltRounds);
        staffData.password = hashedPassword;

        // Store the token in the staff data
        staffData.token = token;

        // Set default status to 'Active' if not provided
        staffData.status = staffData.status || "Active";

        // Set the 'createdby' field to the role extracted from the token
        staffData.createdby = role;

        // Create a new staff document
        const newStaff = new Staff(staffData);

        // Save to the database
        await newStaff.save();

        // Return success response
        return res
            .status(201)
            .json({ message: "Staff member created successfully", staff: newStaff });
    } catch (error) {
        console.error("Error creating staff member:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        const staff = await Staff.findOne({ token: token });

        // Check if a supplier with the matching token is found
        if (!staff) {
            return 
        }

        // Fetch all staff members
        const staffMembers = await Staff.find();
        return res.status(200).json({ staffMembers });
    } catch (error) {
        console.error("Error fetching staff members:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update staff details or status
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if the password is provided in the request and hash it
        if (updates.password) {
            // If password is present, hash it before updating
            const saltRounds = 10;
            updates.password = await bcrypt.hash(updates.password, saltRounds);
        }

        // Find the staff by ID and update
        const updatedStaff = await Staff.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        return res
            .status(200)
            .json({ message: "Staff member updated successfully", staff: updatedStaff });
    } catch (error) {
        console.error("Error updating staff member:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Delete a staff member
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStaff = await Staff.findByIdAndDelete(id);

        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        return res
            .status(200)
            .json({ message: "Staff member deleted successfully", staff: deletedStaff });
    } catch (error) {
        console.error("Error deleting staff member:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get a single staff member
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findById(id);

        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        return res.status(200).json({ message: "Staff member retrieved successfully", staff });
    } catch (error) {
        console.error("Error retrieving staff member:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};