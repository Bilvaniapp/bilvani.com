const Coupon = require('../../../mongodb/admin_Side/couponCodeGenMongo/couponCodeGenMongo');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
      
      // Extract coupon data from the request body
      const { name, couponCode, expiryTime, percentage, isOneTimeUse } = req.body;

      // Create a new coupon
      const newCoupon = new Coupon({
          name,
          couponCode,
          expiryTime,
          percentage,
          isOneTimeUse,
      });

      // Save the coupon to the database
      const savedCoupon = await newCoupon.save();

      res.status(201).json({
          message: 'Coupon created successfully',
          coupon: savedCoupon,
      });
  } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Get all coupons or a specific coupon by code
exports.getCoupons = async (req, res) => {
  try {
      const { couponCode } = req.query;

      if (couponCode) {
          // Find the coupon by the provided code
          const coupon = await Coupon.findOne({ couponCode });

          if (!coupon) {
              return res.status(404).json({ message: 'Invalid coupon code' });
          }

          // Check if the coupon is expired
          const currentTime = new Date();
          if (coupon.expiryTime < currentTime) {
              return res.status(400).json({ message: 'Expired coupon code' });
          }

          return res.status(200).json(coupon);
      } else {
          // Return an error message if no couponCode is provided
          return res.status(400).json({ message: 'Coupon code is required' });
      }
  } catch (error) {
      console.error('Error fetching coupons:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};



// Get a single coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.status(200).json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a coupon by ID
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, durationUnit, price } = req.body;

    
    // Calculate the new expiry time if duration is provided
    let expiryTime;
    const currentTime = Date.now();

    if (durationUnit === 'seconds') {
      expiryTime = new Date(currentTime + duration * 1000);
    } else if (durationUnit === 'minutes') {
      expiryTime = new Date(currentTime + duration * 60 * 1000);
    } else if (durationUnit === 'hours') {
      expiryTime = new Date(currentTime + duration * 60 * 60 * 1000);
    } else {
      return res.status(400).json({ message: 'Invalid duration unit. Use "seconds", "minutes", or "hours".' });
    }

    // Find the coupon by ID and update it
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { name, expiryTime, price },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a coupon by ID
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Verify and Use Coupon

const Product = require('../../../admin_Monogdb/customOrderProductMongo/customOrderProductMongo'); 


exports.useCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body; 
    const { permanentId } = req.cookies; 

    // Validate permanentId
    if (!permanentId) {
      return res.status(400).json({ message: "Invalid request: permanentId not found in cookies" });
    }

    // Validate couponCode
    if (!couponCode) {
      return res.status(400).json({ message: "Invalid request: couponCode is required" });
    }

    
    const coupon = await Coupon.findOne({ couponCode });

   
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

   
    if (coupon.expiryTime && coupon.expiryTime < Date.now()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }


    if (coupon.usedBy.includes(permanentId)) {
      return res.status(400).json({ message: "You have already used this coupon" });
    }

    // Check if the coupon is one-time use
    if (coupon.isOneTimeUse) {
      
      const product = await Product.findOne({ coupon:couponCode });

      if (product) {
       
        coupon.usedBy.push(permanentId);

       
        coupon.isUsed = true;
      }
  
    }


    await coupon.save();

    res.status(200).json({
      message: "Coupon applied successfully",
      discountPercentage: coupon.percentage,
    });
  } catch (error) {
    console.error("Error using coupon:", error);

    // Respond with an error message
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};






