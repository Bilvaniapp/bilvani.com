const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Signup = require('../../mongodb/signupMongo/signupMongo');
const session = require('express-session');
require("dotenv").config();

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Signup.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const permanentId = existingUser.permanentId;

    // Set the cookie with HttpOnly and other attributes
    res.cookie('permanentId', permanentId, {
      httpOnly: true,
      secure: true, // Ensure secure flag is set in production
      sameSite: 'None', // Adjust this based on your requirements
      path: '/',
     
    });

    res.status(200).json({ permanentId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signinController };
