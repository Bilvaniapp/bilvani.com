const express = require('express');
const router = express.Router();
const { postProduct , getAllProducts, deleteProductById, updateProduct } = require('../../../controller/admin_Side/setCategoryShade/setCategoryShadeControll'); 

router.post('/', postProduct);
router.get('/get', getAllProducts);
router.delete('/delete/:productId',deleteProductById);
router.put('/update/:productId',updateProduct);

module.exports = router;
