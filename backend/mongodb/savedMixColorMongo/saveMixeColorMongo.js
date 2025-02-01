
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
   
    colors: [
        {
            hex: String,
            shade: String,
            shadeName: { type: String, required: true },
            intensity: Number
        }
    ],

    mixedColorHex: String,
   
    colorCode: {
        type: String,
        required: true
    },
   
    
    
});

const Color = mongoose.model('saveMixedColor', colorSchema);

module.exports = Color;
