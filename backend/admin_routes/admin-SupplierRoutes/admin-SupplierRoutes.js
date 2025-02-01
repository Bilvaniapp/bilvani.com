const express = require('express');
const router = express.Router();
const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getAllSuppliers,
    getSupplierById
} = require('../../admin_controller/admin-SupplierControl/admin-SupplierControl');

// Route for creating a new supplier
router.post('/api/bilvani/admin/create/supplier', createSupplier);

// Route for updating a supplier
router.put('/api/bilvani/admin/update/supplier/:id', updateSupplier);

// Route for deleting a supplier
router.delete('/api/bilvani/admin/delete/supplier/:id', deleteSupplier);

// Route for getting all suppliers
router.get('/api/bilvani/admin/suppliers/get/all', getAllSuppliers);

// Route for getting a supplier by ID
router.get('/api/bilvani/admin/get/supplier/:id', getSupplierById);

module.exports = router;
