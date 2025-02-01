const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { verifyPayment, getOrderByPermanentId, getOrderById, getComfirmeorderAdmin } = require('../../controller/orderConfirmControl/orderConfirmControl');

// Define your routes here

router.use(cookieParser());
router.post('/verify-payment-confirmsave', verifyPayment);

router.get('/getOrderconfirm',getOrderByPermanentId);
router.get('/get-order-confrim-id/:orderId', getOrderById);

router.get('/api/bilvani/admin/order',getComfirmeorderAdmin);

module.exports = router;
