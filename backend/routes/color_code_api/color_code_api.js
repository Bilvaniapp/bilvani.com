const express =  require("express");

const router = express.Router();

const {colorCodeApi} = require('../../controller/color_code_api/color_code_api')

router.route("/color-api").get(colorCodeApi);


module.exports = router;