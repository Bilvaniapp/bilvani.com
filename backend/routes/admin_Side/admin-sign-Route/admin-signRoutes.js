const express = require("express");

const router = express.Router();

const {adminsignup}= require('../../../controller/admin_Side/admin-sign-upControl/admin-sign-Control')

router.route('/api/admin/register').post(adminsignup);


module.exports = router;