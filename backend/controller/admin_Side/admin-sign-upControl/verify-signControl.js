const bcrypt = require('bcrypt');
const Signup = require('../../../mongodb/admin_Side/admin-sign-Mongo/admin-sign-Mongo');
const OtpServer = require('../../../mongodb/otpSave/otpSave');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const adminverifyOTP = async (req, res) => {
    try {
        const { email, otp, name, password,category , storeAddress} = req.body;

        
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const otpRecord = await OtpServer.findOne({ token: email, otp, otpExpiresAt: { $gt: new Date() } });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await OtpServer.deleteOne({ _id: otpRecord._id });

       
        console.log('Password:', password); 
        const hashedPassword = await bcrypt.hash(password, 12); 

        
        const newUser = new Signup({
            email,
            name,
            category,
            storeAddress,
            password: hashedPassword,
            verified: true 
        });

   
        await newUser.save();

      
        const token = jwt.sign({ email: newUser.email, role: newUser.category}, process.env.JWT_SECRET, );

        newUser.token = token;
        await newUser.save();

        res.setHeader('Authorization', `Bearer ${token}`);

       
        res.cookie('token', token, {
            httpOnly: false,
            secure: true, 
            sameSite: 'None', 
            path: '/',
        });

        return res.status(200).json({ message: 'Signup successful', token });
    } catch (error) {
        console.error('Error verifying OTP and signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { adminverifyOTP };