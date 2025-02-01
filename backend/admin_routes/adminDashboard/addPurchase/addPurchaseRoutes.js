const express = require('express');
const router = express.Router();
const purchaseController = require('../../../admin_controller/adminDashboard/addPurchase/addPurchaseControl');

// Route to create a new purchase
router.post('/api/bilvani/admin/create/purchase', purchaseController.createPurchase);

// Route to get a single purchase by ID
router.get('/api/bilvani/admin/get/purchase/:id', purchaseController.getPurchaseById);

// Route to get all purchases
router.get('/api/bilvani/admin/getall/purchase', purchaseController.getAllPurchases);

// Route to update a purchase by ID
router.put('/api/bilvani/admin/update/purchase/:id', purchaseController.updatePurchaseById);

// Route to delete a purchase by ID
router.delete('/api/bilvani/admin/delete/purchase/:id', purchaseController.deletePurchaseById);

module.exports = router;
