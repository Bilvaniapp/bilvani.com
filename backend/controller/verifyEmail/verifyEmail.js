const bcrypt = require('bcrypt');
const Signup = require('../../mongodb/signupMongo/signupMongo');
const OtpServer = require('../../mongodb/otpSave/otpSave');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Function to generate a random permanent ID
const generatePermanentId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp, name, password, phone } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if OTP exists and is valid
        const otpRecord = await OtpServer.findOne({ token: email, otp, otpExpiresAt: { $gt: new Date() } });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Remove the OTP record as it's no longer needed
        await OtpServer.deleteOne({ _id: otpRecord._id });

        // Generate permanent ID
        const permanentId = generatePermanentId();

        // Hash the password
        console.log('Password:', password); // Logging the password to debug
        const hashedPassword = await bcrypt.hash(password, 12); // Hashing the password

        // Create a new user object
        const newUser = new Signup({
            permanentId,
            email,
            name,
            password: hashedPassword,
            phone,
            verified: true // Marking the user as verified
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save the token in the database
        newUser.token = token;
        await newUser.save();

        res.setHeader('Authorization', `Bearer ${permanentId}`);

        // Set the token as a cookie
        res.cookie('permanentId', permanentId, {
            httpOnly: true,
            secure: true, // Ensure secure flag is set in production
            sameSite: 'None', // Adjust this based on your requirements
            path: '/',
           
          });

        return res.status(200).json({ message: 'Signup successful', permanentId });
    } catch (error) {
        console.error('Error verifying OTP and signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { verifyOTP };