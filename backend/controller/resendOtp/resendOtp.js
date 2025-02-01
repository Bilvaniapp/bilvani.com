const Signup = require('../../mongodb/signupMongo/signupMongo');
const OtpServer = require('../../mongodb/otpSave/otpSave');
const nodemailer = require('nodemailer');

require("dotenv").config();

//// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const existingEmailSignup = await OtpServer.findOne({ token: email });
        if (!existingEmailSignup || existingEmailSignup.verified) {
            return res.status(400).json({ error: 'Email not found or already verified' });
        }

        const otp = generateOTP(); // Generate new OTP

        // Send OTP email
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
            text: `Your OTP for email verification is: ${otp}`,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send OTP email' });
            } else {
                console.log('OTP Email resent:', info.response);

                // Update OTP and its expiration time
                existingEmailSignup.otp = otp;
                existingEmailSignup.otpExpiresAt = Date.now() + 600000; // 10 minutes from now
                await existingEmailSignup.save();

                res.status(200).json({ message: 'OTP resent successfully' });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { resendOTP };
