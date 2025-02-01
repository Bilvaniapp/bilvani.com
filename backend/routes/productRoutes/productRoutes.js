const express = require("express");
const {  createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, searchProducts,getSuggestionsByCategory } = require("../../controller/productControl/productControl");

const router = express.Router();


router.route('/').post(createProduct);

router.route('/update-product/:productId').put(updateProduct);

router.route('/delete-product/:mainId').delete(deleteProduct);

router.route('/get/all/product').get(getAllProducts);

router.route('/get-product-byId/:productId').get(getProductById);

router.route('/search-products').get(searchProducts);

router.route('/product/:productId/suggestions').get(getSuggestionsByCategory);



module.exports = router;