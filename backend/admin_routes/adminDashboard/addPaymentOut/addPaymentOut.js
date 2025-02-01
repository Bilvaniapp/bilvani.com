const express = require('express');
const router = express.Router();
const paymentOutController = require('../../../admin_controller/adminDashboard/addPaymentOut/addPaymentOut');

// Route to create a new payment out
router.post('/api/bilvani/admin/create/paymentout', paymentOutController.createPaymentOut);


// Route to get all payment outs
router.get('/api/bilvani/admin/getall/paymentout', paymentOutController.getAllPaymentOuts);

module.exports = router;
