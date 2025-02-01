const Otp = require("../../admin_Monogdb/codOtpMongo/codOtp");
const Product = require("../../admin_Monogdb/customOrderProductMongo/customOrderProductMongo");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Signup = require('../../mongodb/admin_Side/admin-sign-Mongo/admin-sign-Mongo');
const StoreOrder = require('../../admin_Monogdb/storeOrder/storeOrderMongo');

exports.generateCodOtp = async (req, res) => {
  try {
    const permanentId = req.cookies.permanentId; // Get permanentId from cookies

    if (!permanentId) {
      return res
        .status(400)
        .json({ error: "permanentId is required in cookies" });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in MongoDB
    const otpData = new Otp({
      userId: permanentId,
      otp,
      createdAt: new Date(),
    });

    await otpData.save();

    res.status(200).json({
      message: "OTP generated successfully",
      otp, // Send OTP directly to display it
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchOtpData = async (req, res) => {
  try {
    // Extract permanentId from cookies
    const permanentId = req.cookies.permanentId;

    // Check if permanentId exists
    if (!permanentId) {
      return res.status(400).json({ error: "No permanentId found in cookies" });
    }

    // Fetch the most recent OTP data
    const otpData = await Otp.findOne({ userId: permanentId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    if (!otpData) {
      return res
        .status(404)
        .json({ error: "No OTP data found for this permanentId" });
    }

    // Return the latest OTP
    return res.status(200).json({ success: true, otp: otpData.otp });
  } catch (error) {
    console.error("Error fetching OTP data:", error);
    return res.status(500).json({ error: "Failed to fetch OTP data" });
  }
};

exports.verifyCodOtp = async (req, res) => {
  try {
    const { otp, productDetails } = req.body; // Destructure OTP and product details
    const permanentId = req.cookies.permanentId; // Get permanentId from cookies

    if (!permanentId) {
      return res
        .status(400)
        .json({ error: "permanentId is required in cookies" });
    }

    // Validate OTP from the database
    const otpRecord = await Otp.findOne({ userId: permanentId, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Delete OTP after successful validation
    await Otp.deleteOne({ userId: permanentId, otp });
    
      // Fetch the first storeAddress from any Signup record (no identifier)
      const signupRecords = await Signup.find({});

      if (!signupRecords.length) {
        return res.status(400).json({ error: "No Signup records found" });
      }
  
      // Find the first record with storeAddress
      const storeAddress = signupRecords.find(record => record.storeAddress)?.storeAddress;
  
      if (!storeAddress) {
        return res.status(400).json({ error: "Store address not found in any Signup record" });
      }
  
      // Check if storeAddress is provided in productDetails; if not, use the one from Signup
      const finalStoreAddress = productDetails.storeAddress || storeAddress;


    // Save product details to the database
    const product = new Product({
      ...productDetails,
      permanentId: permanentId,
      storeAddress:finalStoreAddress,
      reasonReject: " ",
    });

    await product.save(); // Save to MongoDB

    res.status(201).json({
      message: "Cash on delivery order created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const instance = new Razorpay({
  key_id: "rzp_test_4bOOuV1CTln2bE", // Replace with your Razorpay Key ID
  key_secret: "lpoFpmf5F9xYNViH2SiE6pcr", // Replace with your Razorpay Key Secret
});

// Create Razorpay Order
exports.createPayment = async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // Razorpay accepts amount in paise (1 INR = 100 paise)
    currency: "INR",
    receipt: "44",
  };

  try {
    const order = await instance.orders.create(options);
    

    res.status(200).json({
      success: true,
      orderId: order.id, // Send orderId to the frontend
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productDetails,
    } = req.body;

    // Validate request body
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !productDetails
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    // Prepare the string to verify the payment
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate the expected signature using the key secret
    const expectedSignature = crypto
      .createHmac("sha256", "lpoFpmf5F9xYNViH2SiE6pcr") // Replace with your Razorpay secret
      .update(body)
      .digest("hex");

    // Verify the signature
    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

      // Fetch the first storeAddress from any Signup record (no identifier)
      const signupRecords = await Signup.find({});

      if (!signupRecords.length) {
        return res.status(400).json({ error: "No Signup records found" });
      }
  
      // Find the first record with storeAddress
      const storeAddress = signupRecords.find(record => record.storeAddress)?.storeAddress;
  
      if (!storeAddress) {
        return res.status(400).json({ error: "Store address not found in any Signup record" });
      }
  
      // Check if storeAddress is provided in productDetails; if not, use the one from Signup
      const finalStoreAddress = productDetails.storeAddress || storeAddress;

    // If the signature is valid, save the order
    const newOrder = new Product({
      ...productDetails,
      payment: {
        method: "online",
        paymentId: razorpay_payment_id,
      },
      orderStatus: "accepted",
      confirm: "pending",
      storeAddress:finalStoreAddress,
      reasonReject: " ",
    });

    // Save the product details along with the payment details in the database
    const savedOrder = await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "Payment successful and order saved",
      orderDetails: savedOrder,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error); // Log the error for debugging
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

/// Fetch Data for Display Particular Store Address 
exports.fetchDataStoreAddress = async (req, res) => {
  try {
    // Get the storeAddress from cookies
    const storeAddressFromCookie = req.cookies.storeAddress;

    if (!storeAddressFromCookie) {
      return res.status(400).json({
        success: false,
        message: "No store address found in cookies.",
      });
    }

    // Query the database where storeAddress matches
    const orders = await Product.find({
      storeAddress: storeAddressFromCookie,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the provided store address.",
      });
    }

    // Return matched orders
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



/// Fetch Data for Confrimations for All Store 

exports.getPendingConfirmations = async (req, res) => {
  try {
    // Get the storeAddress from cookies
    const storeAddressFromCookie = req.cookies.storeAddress;

    if (!storeAddressFromCookie) {
      return res.status(400).json({
        success: false,
        message: "No store address found in cookies.",
      });
    }

    // Fetch documents where confirm is 'pending' and storeAddress matches
    const pendingProducts = await Product.find({
      confirm: 'pending',
      storeAddress: storeAddressFromCookie,
    });

    if (pendingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending products found for the provided store address.",
      });
    }

    // Respond with the pending products
    res.status(200).json({
      success: true,
      message: 'Pending confirmations fetched successfully.',
      data: pendingProducts,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching pending confirmations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending confirmations.',
      error: error.message,
    });
  }
};

exports.getSignlePendingConfirmations = async (req, res) => {
  try {
    // Get the storeAddress from cookies
    const storeAddressFromCookie = req.cookies.storeAddress;

    if (!storeAddressFromCookie) {
      return res.status(400).json({
        success: false,
        message: "No store address found in cookies.",
      });
    }

    // Check if a productId is provided in the query
    const { productId } = req.query;

    if (productId) {
      // Fetch a single product if productId is provided
      const singleProduct = await Product.findOne({
        _id: productId,
        confirm: 'pending',
        storeAddress: storeAddressFromCookie,
      });

      if (!singleProduct) {
        return res.status(404).json({
          success: false,
          message: "No pending product found with the provided ID for this store address.",
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pending product fetched successfully.',
        data: singleProduct,
      });
    } else {
      // Fetch all pending products if no productId is provided
      const pendingProducts = await Product.find({
        confirm: 'pending',
        storeAddress: storeAddressFromCookie,
      });

      if (pendingProducts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pending products found for the provided store address.",
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Pending confirmations fetched successfully.',
        data: pendingProducts,
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching pending confirmations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending confirmations.',
      error: error.message,
    });
  }
};

/// End

/// Update the confirmation of the Pending 
exports.confirmProduct = async (req, res) => {
  try {
    // Get the storeAddress from cookies
    const storeAddressFromCookie = req.cookies.storeAddress;

    if (!storeAddressFromCookie) {
      return res.status(400).json({
        success: false,
        message: "No store address found in cookies.",
      });
    }

    // Get the productId from the URL parameter
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Find the product that is pending confirmation
    const product = await Product.findOne({
      _id: productId,
      confirm: 'pending',
      storeAddress: storeAddressFromCookie,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already confirmed.",
      });
    }

    // Update the product's confirm field to 'accept'
    product.confirm = 'accepted';
    await product.save(); // Save the updated product

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Product confirmed successfully.',
      data: product,
    });
  } catch (error) {
    // Handle errors
    console.error('Error confirming product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm product.',
      error: error.message,
    });
  }
};


exports.rejectProduct = async (req, res) => {
  try {
    // Get the storeAddress from cookies
    const storeAddressFromCookie = req.cookies.storeAddress;

    if (!storeAddressFromCookie) {
      return res.status(400).json({
        success: false,
        message: "No store address found in cookies.",
      });
    }

    // Get the productId from the URL parameter
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    // Find the product that is pending confirmation
    const product = await Product.findOne({
      _id: productId,
      confirm: 'pending',
      storeAddress: storeAddressFromCookie,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already confirmed.",
      });
    }

    // Update the product's confirm field to 'rejected'
    product.confirm = 'rejected';
    await product.save(); // Save the updated product

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'Product rejected successfully.',
      data: product,
    });
  } catch (error) {
    // Handle errors
    console.error('Error rejecting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject product.',
      error: error.message,
    });
  }
};

/// End


exports.fetchAndVerifyProduct = async (req, res) => {
  const { permanentId } = req.cookies;

  if (!permanentId) {
      return res.status(400).json({ success: false, message: "Permanent ID is required." });
  }

  try {
      // Fetch the product by permanentId
      const product = await Product.findOne({ permanentId });

      if (!product) {
          return res.status(404).json({ success: false, message: "Product not found." });
      }

      // If found, return the product data
      return res.status(200).json({ success: true, data: product });
  } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
  }
};



exports.getMachineApi = async (req, res) => {
  try {

    const storeOrder = await StoreOrder.findOne(
      {
        confirm: 'accepted',
        fetch: false,
      },
      { _id: 1, shade: 1, mixColor: 1, phoneNumber: 1,userName: 1 } 
    );

    if (storeOrder) {
   
      await StoreOrder.updateOne(
        { _id: storeOrder._id },
        { $set: { fetch: true } }
      );

      return res.status(200).json({
        success: true,
        message: 'StoreOrder data fetched and updated successfully.',
        type: 'StoreOrder', 
        colorData: {
          storeOrders: [{
            id: storeOrder._id, 
            shade: storeOrder.shade,
            mixColor: storeOrder.mixColor,
            phoneNumber: storeOrder.phoneNumber,
            userName:storeOrder.userName
          }],
        },
      });
    }

    
    const product = await Product.findOne(
      {
        confirm: 'accepted',
        fetch: false,
      },
      { _id: 1, shade: 1, mixColor: 1, phoneNumber: 1,userName:1 } 
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No accepted products or store orders found, or all have already been fetched.",
      });
    }

  
    await Product.updateOne(
      { _id: product._id },
      { $set: { fetch: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'Product data fetched and updated successfully.',
      type: 'Product',
      colorData: {
        products: [{
          id: product._id,
          shade: product.shade,
          mixColor: product.mixColor,
          phoneNumber: product.phoneNumber,
          userName:product.userName
        }],
      },
    });

  } catch (error) {
    console.error('Error fetching store orders or products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store order or product data.',
      error: error.message,
    });
  }
};





exports.updateOrderComplement = async (req, res) => {
  try {
    const { id, type } = req.body; 

    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: 'ID and type are required to update orderComplement.',
      });
    }

    let model;
    if (type === 'StoreOrder') {
      model = StoreOrder;
    } else if (type === 'Product') {
      model = Product;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type specified. Must be either "StoreOrder" or "Product".',
      });
    }

    const result = await model.updateOne(
      { _id: id },
      { $set: { orderComplete: true } } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No document found with the specified ID in ${type}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `The ${type} document's orderComplement field has been successfully updated.`,
    });
  } catch (error) {
    console.error('Error updating orderComplement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update orderComplement.',
      error: error.message,
    });
  }
};

exports.updateOrderComplementParmar = async (req, res) => {
  try {
    const { id, type } = req.params; // Extract `id` and `type` from the URL parameters

    if (!id || !type) {
      return res.status(400).json({
        success: false,
        message: 'Both ID and type are required as URL parameters to update orderComplement.',
      });
    }

    let model;
    if (type === 'StoreOrder') {
      model = StoreOrder;
    } else if (type === 'Product') {
      model = Product;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type specified. Must be either "StoreOrder" or "Product".',
      });
    }

    const result = await model.updateOne(
      { _id: id },
      { $set: { orderComplete: true } } // Update the `orderComplete` field
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No document found with the specified ID in ${type}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `The ${type} document's orderComplement field has been successfully updated.`,
    });
  } catch (error) {
    console.error('Error updating orderComplement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update orderComplement.',
      error: error.message,
    });
  }
};
