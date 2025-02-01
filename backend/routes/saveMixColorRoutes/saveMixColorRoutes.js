const express = require('express');
const router = express.Router();
const multer = require('multer');
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware

const { getsaveColor,getDataMachine, uploadExcel ,getColorsByShade ,getAllColors, getColorsByColorCode,getAllExcel,deleteColorById } = require('../../controller/saveMixColorControl/saveMixColorControl');

// Use cookie-parser middleware
router.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-excel', upload.single('file'), uploadExcel);
router.route('/api/bilvani/shade/color').get(getColorsByShade);
//this will get only shade 
router.route('/api/bilvani/all/shade/color').get(getAllColors);
// end 
router.route('/api/bilvani/fetch/code/color').get(getColorsByColorCode);

router.route('/api/bilvani/get/all/excel').get(getAllExcel);
router.route('/api/bilvani/delete/:id').delete(deleteColorById);






// not use 
router.route('/get-color-save').get(getsaveColor);

router.route('/api/developer/save-color').get(getDataMachine)
// End

module.exports = router;
