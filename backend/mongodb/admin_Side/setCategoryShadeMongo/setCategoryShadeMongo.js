const mongoose = require('mongoose');


// Define the schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,

  },
  mrp: {
    type: Number,

  },
  discountPrice: {
    type: String,
 
  },
  images: [{ type: String }],
});

// Create the model
const Product = mongoose.model('Set-Category-Shade', productSchema);

module.exports = Product;
