const express = require('express');
const router = express.Router();

const { customColorOrder, getCustomColorOrder, getCustomOrderById, getOrderAlladmin } = require('../../controller/customColorOrderControl/customColorOrderControl'); // Correct path


router.post('/api/bilvani/create/customcolororder', customColorOrder);


router.get('/api/bilvani/get/customcolororder', getCustomColorOrder);

router.get('/api/bilvani/get/customcolororder/:orderId', getCustomOrderById);


router.get('/api/bilvani/get/admin', getOrderAlladmin);

module.exports = router;
