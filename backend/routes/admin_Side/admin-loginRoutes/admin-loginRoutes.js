const express = require("express");
const router = express.Router();
const { adminloginControl } = require("../../../controller/admin_Side/admin-loginControl/admin-loginControl");


router.route('/api/login/admin').post(adminloginControl);

module.exports = router