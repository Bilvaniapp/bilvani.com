
const nodemailer = require('nodemailer');
const Signup = require('../../mongodb/signupMongo/signupMongo'); 
const OtpServer = require('../../mongodb/otpSave/otpSave');
const bcrypt = require('bcrypt'); 

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
        text: `Your OTP for email verification is: ${otp}. This will expire in 10 minutes.`,
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

// Function to store OTP and its expiration time
const storeOTPAndExpiration = async (otp, expirationTime, token) => {
    // Save only the OTP and its expiration time
    const otpSave = new OtpServer({
        otp,
        otpExpiresAt: expirationTime,
        token,
    });

    // Save the new OTP details
    await otpSave.save();
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Signup.findOne({ email });
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





exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find the user with the matching email and OTP, and ensure the OTP is not expired
        const user = await Signup.findOne({ email, otp, otpExpiresAt: { $gt: Date.now() } });
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
