const express = require('express');
const router = express.Router();
const cashOnDeliveryController = require('../../admin_controller/customOrderProductControll/customOrderProductControll');
const paymentController  = require('../../admin_controller/customOrderProductControll/customOrderProductControll');

// Generate OTP for COD
router.post('/api/bilvani/generate/cod/otp', cashOnDeliveryController.generateCodOtp);

// Verify OTP and create order
router.post('/api/bilvani/verify/otp/order/confirmed', cashOnDeliveryController.verifyCodOtp);

router.get('/api/bilvani/generate/get/otp' , cashOnDeliveryController.fetchOtpData);

router.post('/api/bilvani/create/online/payment', paymentController.createPayment);
router.post('/api/bilvani/verify/online/payment', paymentController.verifyPayment);




/// Fetch the data for to display all product in Store
router.get('/api/bilvani/fetch/store/address' , cashOnDeliveryController.fetchDataStoreAddress);

router.get('/api/bilvani/fetch/data/user' , cashOnDeliveryController.fetchAndVerifyProduct);

/// Api For Machine
router.get('/api/bilvani/machine/fetch', cashOnDeliveryController.getMachineApi);
router.post('/api/bilvani/update/order/complemet', cashOnDeliveryController.updateOrderComplement);
router.post('/api/bilvani/update/order/:id/:type', cashOnDeliveryController.updateOrderComplementParmar);

/// Api End For Machine

///Fetching Pending data to display on Dashboard
router.get('/api/bilvani/fetch/pending/product' , cashOnDeliveryController.getPendingConfirmations);
router.get('/api/bilvani/fetch/single/pending/product' , cashOnDeliveryController.getSignlePendingConfirmations);
/// End 

router.put('/api/bilvani/update/pending/product/:productId', cashOnDeliveryController.confirmProduct);

router.put('/api/bilvani/update/reject/product/:productId', cashOnDeliveryController.rejectProduct);


module.exports = router;
