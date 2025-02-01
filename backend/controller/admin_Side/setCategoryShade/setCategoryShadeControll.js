const Product = require('../../../mongodb/admin_Side/setCategoryShadeMongo/setCategoryShadeMongo'); // Path to your Mongoose model

// Controller function to handle the POST request
const postProduct = async (req, res) => {
  try {
    const { name, mrp, discountPrice } = req.body;
    const images = req.files.map(file => file.filename);

    const newProduct = new Product({
      name,
      mrp,
      discountPrice,
      images,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
  
    const products = await Product.find(); 

    
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

   
    res.status(200).json({ success: true, data: products });
  } catch (error) {

    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get the product ID from the request parameters
    const { name, mrp, discountPrice } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If new images are uploaded, get their filenames; otherwise, retain the existing images
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => file.filename) 
      : product.images; // Retain existing images if no new files are provided

    // Build the update object
    const updatedProductData = {
      name: name || product.name, // Keep existing name if not provided
      mrp: mrp || product.mrp, // Keep existing MRP if not provided
      discountPrice: discountPrice || product.discountPrice, // Keep existing discountPrice if not provided
      images, // Retain existing images or update with new ones
    };

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } // This option ensures the returned document is the updated one
    );

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  postProduct,
  getAllProducts,
  deleteProductById,
  updateProduct
};


