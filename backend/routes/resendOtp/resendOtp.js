const express = require("express");

const router = express.Router();

const {resendOTP} = require('../../controller/resendOtp/resendOtp')
router.route('/').post(resendOTP);


module.exports = router;