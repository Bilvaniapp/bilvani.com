const express = require('express');

const router = express.Router();

const {getdetails} = require('../../controller/userSignUpInfoControl/userSignUpInfoControl');

router.route('/user-details').get(getdetails);


module.exports = router;