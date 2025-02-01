
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [subcategorySchema],
  token:{type:String},
  isDeleted: { type: Boolean, default: false }
});

const Category = mongoose.model('Product-Category', categorySchema);

module.exports = Category;
