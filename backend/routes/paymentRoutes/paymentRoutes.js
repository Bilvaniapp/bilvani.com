const express = require("express");

const router = express.Router();

const { createPayment, verifyPayment } = require("../../controller/paymentControl/paymentControl");


router.route("/createrazor").post(createPayment);
router.route("/verify").post(verifyPayment);

module.exports = router;    