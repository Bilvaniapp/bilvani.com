const express = require("express");
const router = express.Router();
const staffController = require("../../../admin_controller/adminDashboard/addstaff/addstaffControll"); // Adjust the path if needed

// Route to create a new staff member
router.post("/api/bilvani/admin/create/staff", staffController.createStaff);

// Route to get all staff members
router.get("/api/bilvani/admin/getall/staff", staffController.getAllStaff);

// Route to get a single staff member by ID
router.get("/api/bilvani/admin/get/staff/:id", staffController.getStaffById);

// Route to update staff details or status
router.put("/api/bilvani/admin/update/staff/:id", staffController.updateStaff);

// Route to delete a staff member
router.delete("/api/bilvani/admin/delete/staff/:id", staffController.deleteStaff);

module.exports = router;
