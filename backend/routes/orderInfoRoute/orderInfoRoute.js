const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();
const {createInfo , updateInfo, deleteInfo, getInfoByPermanentId } = require('../../controller/orderInfoControl/orderInfoControl')

router.route('/order-user-info').post(createInfo);

router.route('/update-order-user-info/:id').put(updateInfo);

router.route('/delete-order-user-info/:id').delete(deleteInfo);

router.route('/get').get(getInfoByPermanentId);



module.exports = router;