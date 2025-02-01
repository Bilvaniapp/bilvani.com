
const Color = require("../../admin_Monogdb/storeOrder/storeOrderMongo");

// Controller to handle POST request
exports.createColor = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ error: "Token is required in cookies" });
        }

        const {
            shade,
            mixColor,
            colorCode,
            productName,
            confirm,
            userName,
            phoneNumber,
            fetch,
        } = req.body;

        // Create a new color document with the token
        const newColor = new Color({
            shade,
            mixColor,
            colorCode,
            productName,
            confirm,
            userName,
            phoneNumber,
            fetch,
            token, // Include token in the document
        });

        // Save the color document to the database
        const savedColor = await newColor.save();
        res.status(201).json({
            message: "Color successfully created",
            data: savedColor,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating color",
            error: error.message,
        });
    }
};
