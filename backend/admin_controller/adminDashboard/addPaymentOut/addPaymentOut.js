const PaymentOut = require('../../../admin_Monogdb/adminDashboard/addPaymentOut/addPaymentOut');

// Create a new payment out
exports.createPaymentOut = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        const paymentOutData = req.body;


        paymentOutData.paymentStatus = paymentOutData.paymentStatus || "pending"; 
        

        paymentOutData.token = token;


        

        const newPaymentOut = new PaymentOut(paymentOutData);
        await newPaymentOut.save();

        return res.status(201).json({ message: "Payment out created successfully", paymentOut: newPaymentOut });
    } catch (error) {
        console.error("Error creating payment out:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




// Get all payment outs
exports.getAllPaymentOuts = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(400).json({ message: "Token is not provided in cookies" });
        }

        const paymentOut = await PaymentOut.findOne({ token: token });

        // Check if a supplier with the matching token is found
        if (!paymentOut) {
            return 
        }
        // Fetch all payment outs
        const paymentOuts = await PaymentOut.find();
        return res.status(200).json({ paymentOuts });
    } catch (error) {
        console.error("Error fetching payment outs:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
