const OtpServer = require('../../mongodb/otpSave/otpSave');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Signup = require('../../mongodb/signupMongo/signupMongo');
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp} .This will be Expires in 10 min`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const signup = async (req, res) => {
    try {
        // Check if the email is already registered
        const existingUser = await Signup.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const existingPhone = await Signup.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone is already registered' });
        }
        // Generate OTP
        const otp = generateOTP();

        // Send OTP email
        const emailSent = await sendOTPEmail(req.body.email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        // Calculate expiration time (10 minutes from now)
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP and its expiration time
        await storeOTPAndExpiration(otp, expirationTime, req.body.email);

        // Respond with success and token
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const storeOTPAndExpiration = async (otp, expirationTime, token) => {
    // Save only the OTP and its expiration time
    const otpSave = new OtpServer({
        otp,
        otpExpiresAt: expirationTime,
        token
    });

    // Save the new OTP details
    await otpSave.save();
};

module.exports = { signup };
