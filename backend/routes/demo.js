const express = require("express");
const router = express.Router();
const { jaishree } = require('../controller/demo');

router.get('/', jaishree);

module.exports = router;
