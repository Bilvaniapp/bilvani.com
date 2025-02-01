
const addToCartModel = require('../../mongodb/addToCartMongo/addToCartMongo');
const Product = require('../../mongodb/productMongo/productMongo');





exports.addItem = async (req, res) => {
    try {
        const { permanentId, productId, quantity } = req.body;

        if (!permanentId || !productId || !quantity) {
            return res.status(400).json({ error: 'Permanent ID, Product ID, and Quantity are required.' });
        }

        // Find the product by productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Calculate the total price based on quantity
        const totalPrice = product.actualPrice * quantity;

        // Find if the item already exists in the cart
        const existingCartItem = await addToCartModel.findOne({ permanentId, productId });

        if (existingCartItem) {
            // If the item exists, update the quantity and total price
            existingCartItem.quantity += quantity;
            existingCartItem.totalPrice += totalPrice;
            await existingCartItem.save();
            return res.status(200).json({ message: 'Item quantity updated in cart.', updatedItem: existingCartItem });
        } else {
            // If the item doesn't exist, create a new cart item
            const newItem = new addToCartModel({
                permanentId,
                productId,
                product: {
                    // Include only necessary product details in the cart item
                    title: product.title,
                    actualPrice: product.actualPrice,
                    discountedPrice: product.discountedPrice,
                    discount: product.discount,
                    description: product.description,
                    returnPolicy: product.returnPolicy,
                    outOfStock: product.outOfStock,
                    images: product.images,
                },
                quantity,
                totalPrice
            });

            await newItem.save();
            return res.status(201).json({ message: 'Item added to cart successfully.', newItem });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal server error.' });
    }
};


exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId, newQuantity } = req.body;

        if (!itemId || !newQuantity) {
            return res.status(400).json({ error: 'Item ID and new quantity are required.' });
        }

        // Find the cart item by itemId
        const cartItem = await addToCartModel.findById(itemId);

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        // Update the quantity and total price based on the new quantity
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = cartItem.product.actualPrice * newQuantity;

        // Save the updated cart item
        await cartItem.save();

        return res.status(200).json({ message: 'Cart item quantity updated successfully.', updatedCartItem: cartItem });
    } catch (error) {
        console.error('Error updating cart item quantity:', error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal server error.' });
    }
};


// Controller function to delete an item from the cart

exports.deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // Check if the item exists in the cart
        const item = await addToCartModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in the cart" });
        }

        // Remove the item from the cart
        await addToCartModel.findByIdAndDelete(itemId);

        res.status(200).json({ message: "Item deleted from the cart successfully" });
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Controller function to get all items in the cart
exports.getAllItems = async (req, res) => {
     try {
        const permanentId = req.cookies.permanentId;

        if (!permanentId) {
            return res.status(400).json({ error: 'Permanent ID not found in cookies.' });
        }

        const items = await addToCartModel.findByPermanentId(permanentId);

        if (!items || items.length === 0) {
            return res.status(404).json({ error: 'Items not found for the given Permanent ID.' });
        }

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};