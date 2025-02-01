const express = require('express');
const router = express.Router();
const { cancelOrder } = require('../../controller/cancelOrderControl/cancelOrderControl');

// Route to cancel an order

router.post('/cancel-order', cancelOrder);

module.exports = router;
