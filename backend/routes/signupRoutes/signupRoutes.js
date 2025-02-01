const express = require("express");

const router = express.Router();

const {signup} = require('../../controller/signupController/signupController')
router.route('/').post(signup);


module.exports = router;