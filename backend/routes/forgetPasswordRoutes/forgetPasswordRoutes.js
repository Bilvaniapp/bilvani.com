

const express = require('express');
const { forgotPassword, resetPassword } = require('../../controller/forgetPasswordControl/forgetPasswordControl');
const router = express.Router();


// Route to handle forgot password
router.post('/forgot-password',forgotPassword);

// Route to handle reset password
router.post('/reset-password',resetPassword);

module.exports = router;
