const bcrypt = require('bcrypt');
const Signup = require('../../../mongodb/admin_Side/admin-sign-Mongo/admin-sign-Mongo');
const Client = require("../../../admin_Monogdb/adminClientMongo/adminClientMongo");

require("dotenv").config();

const adminloginControl = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in both admin and client collections
    const existingAdmin = await Signup.findOne({ email });
    const existingClient = await Client.findOne({ email });

    if (!existingAdmin && !existingClient) {
      return res.status(404).json({ error: 'User not found' });
    }

    let user;

    // Determine which collection the user belongs to and validate password
    if (existingAdmin && await bcrypt.compare(password, existingAdmin.password)) {
      user = existingAdmin;
    } else if (existingClient && await bcrypt.compare(password, existingClient.password)) {
      user = existingClient;
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get the category from the user's data
    const category = user.category;
    const storeAddress = (user.billingAddress && user.city && user.state) ? 
    `${user.billingAddress}, ${user.city}, ${user.state}` : 
    user.storeAddress;
    
    
 
    const token = user.token;

    // Set the token and category in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // ensure it's only secure in production
      sameSite: 'None',
      path: '/',
    });

    res.cookie('category', category, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    res.cookie('storeAddress', storeAddress, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    // Send response with success message
    res.status(200).json({
      message: "Login Successful",
      token,
      category, 
      storeAddress
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { adminloginControl };
