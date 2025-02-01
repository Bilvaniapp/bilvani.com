const express = require('express');

const router = express.Router();

const {verifyOTP} = require('../../controller/verifyEmail/verifyEmail');

router.route('/').post(verifyOTP);


module.exports = router;