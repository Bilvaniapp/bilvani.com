const express = require('express');
const router = express.Router();
const paymentInController = require('../../../admin_controller/adminDashboard/addPayemntIn/addPayemntIn');

// Create a new payment entry
router.post('/api/bilvani/admin/create/paymentIn', paymentInController.createPaymentIn);

// Get all payments
router.get('/api/bilvani/admin/getall/paymentIn', paymentInController.getAllPaymentsIn);

// update
router.put('/api/bilvani/admin/update/paymentIn/:id', paymentInController.updatePaymentIn);

// Delete payment entry by invoice number
router.delete('/api/bilvani/admin/delete/paymentIn/:id', paymentInController.deletePaymentIn);

// Get payment by invoice number
router.get('/api/bilvani/admin/get/paymentIn/:id', paymentInController.getPaymentInById);
module.exports = router;
