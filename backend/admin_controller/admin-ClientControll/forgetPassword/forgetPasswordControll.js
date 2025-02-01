const nodemailer = require('nodemailer');
const Signup = require('../../../mongodb/admin_Side/admin-sign-Mongo/admin-sign-Mongo');
const Client = require('../../../admin_Monogdb/adminClientMongo/adminClientMongo');
const bcrypt = require('bcrypt');

// Generate OTP function
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
        subject: '[Admin]Password Reset Verification Code',
        html: `
        <p>Dear User,</p>
        <p>We received a request to reset the password for your account. To proceed with the reset, please use the One-Time Password (OTP) below:</p>
        <p><strong>OTP: ${otp}</strong></p>
        <p>This OTP is valid for the next 10 minutes. After the expiration time, you will need to request a new OTP to continue.</p>
        <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
        
        <p>If you encounter any issues or did not initiate this request, please contact our support team immediately.</p>
        <p>Best regards,<br/>Bilvani Ask Your Shade</p>
      `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
       
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Function to store OTP and its expiration time
exports.AdminClientforgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // First, check for admin
        let user = await Signup.findOne({ email });

        // If not found in admin, check in client collection
        if (!user) {
            user = await Client.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP(); // Generate a numeric OTP
        user.otp = otp;
        user.otpExpiresAt = Date.now() + 60000000; // OTP valid for 1 hour
        await user.save();

        // Send OTP via email
        const emailSent = await sendOTPEmail(user.email, otp);

        if (emailSent) {
            res.status(200).json({ message: 'OTP sent to your email' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP email' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to reset the password
exports.ClientresetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // First, check for admin
        let user = await Signup.findOne({ email, otp, otpExpiresAt: { $gt: Date.now() } });

        // If not found in admin, check in client collection
        if (!user) {
            user = await Client.findOne({ email, otp, otpExpiresAt: { $gt: Date.now() } });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear the OTP fields
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
