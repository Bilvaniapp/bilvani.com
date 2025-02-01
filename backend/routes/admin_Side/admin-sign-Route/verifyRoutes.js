const express = require('express');

const router = express.Router();

const {adminverifyOTP} = require('../../../controller/admin_Side/admin-sign-upControl/verify-signControl');

router.route('/api/verify/admin/signup').post(adminverifyOTP);


module.exports = router;