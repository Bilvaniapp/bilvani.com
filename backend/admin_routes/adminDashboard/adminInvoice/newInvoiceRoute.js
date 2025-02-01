// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../../../admin_controller/adminDashboard/newInvoice/newInvoiceControl");

// Create a new invoice
router.post("/api/bilvani/admin/create/invoices", invoiceController.createInvoice);

// Update an invoice
router.put("/api/bilvani/admin/update/invoices/:id", invoiceController.updateInvoice);

// Delete an invoice
router.delete("/api/bilvani/admin/delete/invoices/:id", invoiceController.deleteInvoice);


// Get all invoices
router.get("/api/bilvani/invoice", invoiceController.fetchInvoiceByToken);
router.get("/invoices/all/invoices", invoiceController.getAllInvoices);
// Get a single invoice by ID
router.get("/api/bilvani/admin/get/invoicebyid/:id", invoiceController.getInvoiceById);


router.get("/api/bilvani/admin/get/invoice/bycontact/:contactNo", invoiceController.getInvoiceByContactNo);


module.exports = router;
