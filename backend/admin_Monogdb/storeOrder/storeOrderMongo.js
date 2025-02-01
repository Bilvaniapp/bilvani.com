
const mongoose = require('mongoose');



const colorSchema = new mongoose.Schema({
   
    shade: [
        {
            hex: String,
            shade: String,
            intensity: Number
        }
    ],

    mixColor: { type: String },
   
    colorCode: {
        type: String,
        required: true
    },
   
    productName:{type:String},
  
    confirm: { type: String, enum: ['accepted', 'rejected' ,'pending'], default: "pending" },
    userName:{type:String},
    phoneNumber:{type:String},
    fetch:{ type: Boolean, default: false },
    token:{type:String}
    
    
});

const Color = mongoose.model('storeOrder', colorSchema);

module.exports = Color;
