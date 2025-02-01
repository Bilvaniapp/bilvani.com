const express = require("express");
const router = express.Router();
const { signinController } = require("../../controller/signinController/signinController");





router.route('/').post(signinController);

module.exports = router