// models/cartModel.js
const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
    permanentId: {
        type: String,
        required: true // Ensures that the permanentId field is required
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true // Ensures that the productId field is required
    },
    product: { 
        type: Object,
        required: true // Ensures that the product details are required
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

// Define the static method findByPermanentId
addToCartSchema.statics.findByPermanentId = function(permanentId) {
    return this.find({ permanentId: permanentId }).exec();
};

const addToCartModel = mongoose.model('addToCart', addToCartSchema);

module.exports = addToCartModel;
