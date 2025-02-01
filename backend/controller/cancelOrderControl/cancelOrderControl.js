const CancelOrder = require('../../mongodb/cancelOrderMongo/cancelOrderMongo');
const OrderConfirmed = require('../../mongodb/orderConfirmMongo/orderConfirmMongo');
const CustomColorOrder = require('../../mongodb/customColorOrderMongo/customColorOrderMongo');

// Controller function to cancel an order
exports.cancelOrder = async (req, res) => {
    const { originalOrderId, reason, additionalDetails } = req.body;

    try {
        // Check if the original order exists
        const originalOrder = await OrderConfirmed.findById(originalOrderId) || await CustomColorOrder.findById(originalOrderId);
        if (!originalOrder) {
            return res.status(404).json({ error: 'Original order not found' });
        }

        // Create a new cancellation order
        const cancellation = new CancelOrder({
            originalOrderId,
            reason,
            additionalDetails
        });

        // Save the cancellation order
        const savedCancellation = await cancellation.save();

        // Update the status of the original order to 'cancelled'
        originalOrder.status = 'cancelled';
        await originalOrder.save();

        return res.status(201).json(savedCancellation);
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



