const express = require('express');
const { createColor } = require('../../admin_controller/storeOrderControll/storeOrderControll'); // Update the path if needed

const router = express.Router();

router.post('/api/bilvani/store/order', createColor);

module.exports = router;
