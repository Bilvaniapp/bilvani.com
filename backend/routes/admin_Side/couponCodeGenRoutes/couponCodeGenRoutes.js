const express = require('express');
const couponController = require('../../../controller/admin_Side/couponCodeGenControl/couponCodeGenControl');
const router = express.Router();

router.post('/api/bilvani/create/coupon', couponController.createCoupon);

router.put('/api/bilvani/update/coupon/:id', couponController.updateCoupon);

router.delete('/api/bilvani/delete/coupon/:id', couponController.deleteCoupon);

router.get('/api/bilvani/getall/coupon', couponController.getCoupons);

router.get('/api/bilvani/getsingel/coupon/:id', couponController.getCouponById);


router.post('/api/bilvani/use/coupon', couponController.useCoupon);

module.exports = router;
