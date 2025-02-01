const express = require('express');
const { AdminClientforgotPassword, ClientresetPassword } = require('../../../admin_controller/admin-ClientControll/forgetPassword/forgetPasswordControll');
const router = express.Router();


// Route to handle forgot password
router.post('/api/admin/forgot/password',AdminClientforgotPassword);

// Route to handle reset password
router.post('/api/admin/reset/password',ClientresetPassword);

module.exports = router;
