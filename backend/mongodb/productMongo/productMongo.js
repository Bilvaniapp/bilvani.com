const mongoose = require('mongoose');
const { type } = require('os');


const productSchema = new mongoose.Schema({
  images: [{ type: String }],
  title: { type: String },
  productId:{type:String},
  actualPrice: { type: Number },
  discountedPrice: { type: Number },
  discount: { type: Number },
  description: { type: String },
  returnPolicy: { type: String },
  category: String,
  subcategories: String,
  outOfStock: { type: Boolean, default: false },
  colors: [String], // Storing only hex color codes
});






const Product = mongoose.model('Product', productSchema);

module.exports = Product;