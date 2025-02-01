const express = require("express");
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware
const router = express.Router();
const { getAllItems , addItem , deleteItem ,updateCartItemQuantity } = require("../../controller/addToCartControl/addToCartControl");

router.use(cookieParser());
router.route("/add-cart").post(addItem);
router.route("/update-cart").put(updateCartItemQuantity);
router.route("/cart-get").get(getAllItems);



router.route("/delete-cart/:id").delete(deleteItem);


module.exports = router;    