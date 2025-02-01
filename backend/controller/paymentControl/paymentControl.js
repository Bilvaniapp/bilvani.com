const Razorpay = require('razorpay');
const crypto = require("crypto");
const Pay = require('../../mongodb/paymentMongo/paymentMongo');



// Controller actions
exports.createPayment = async (req, res) => {


    const instance = new Razorpay({
        key_id: "rzp_test_4bOOuV1CTln2bE",
        key_secret: "lpoFpmf5F9xYNViH2SiE6pcr",
    });

    const options = {
        amount: req.body.amount ,
        currency: "INR",
        receipt: "44",
    };

    const order = await instance.orders.create(options);

    console.log(order);
    res.status(200).json({
        success: true,
        order,
    });
};

function generateSignature(orderId, paymentId, secret) {
    const data = orderId + "|" + paymentId;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    return hmac.digest('hex');
}

exports.verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, receivedSignature } = req.body;
    const secret = "lpoFpmf5F9xYNViH2SiE6pcr"; // Replace with your actual secret

    const generatedSignature = generateSignature(razorpayOrderId, razorpayPaymentId, secret);

    if (generatedSignature === receivedSignature) {
        // Payment verification successful, save the data to the database
        try {
            const savePayment = new Pay({
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id:razorpayPaymentId,
                razorpay_signature:receivedSignature
            })
            await savePayment.save();
            res.status(200).json({ success: true, message: "Payment verified and data saved successfully." });
        } catch (error) {
            console.error("Error saving payment verification data:", error);
            res.status(500).json({ success: false, error: "Internal server error." });
        }
    } else {
        res.status(400).json({ success: false, error: "Payment verification failed." });
    }
};

