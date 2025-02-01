const Order = require('../../mongodb/userOrderInfo/userOrderInfoMongo');
//const { v4: uuidv4 } = require('uuid');

exports.createInfo = async (req, res) => {
  try {

    const permanentId = req.cookies.permanentId;

    if (!permanentId) {
      return res.status(400).send({ message: 'Permanent ID is required' });
    }
    const { customerFirstName, customerLastName, phoneNumber, address, pincode, orderDate, city, district, state } = req.body;

    const orderData = {
      customerFirstName,
      customerLastName,
      phoneNumber,
      address,
      pincode,
      orderDate,
      city,
      district,
      state,
      permanentId
    };
    const order = new Order(orderData);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.updateInfo = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteInfo = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.send({ order, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getInfoByPermanentId = async (req, res) => {
  try {
    // Extract permanentId from the Authorization header
    const authorizationHeader = req.headers.authorization;

    // Extract permanentId from the Authorization header if present
    let permanentId;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      permanentId = authorizationHeader.split(' ')[1];
    } else {
      // Check if permanentId cookie exists
      if (!req.cookies || !req.cookies.permanentId) {
        return res.status(401).json({ error: 'PermanentId cookie not found' });
      }
      permanentId = req.cookies.permanentId;
    }

    // Find all orders using the permanentId
    const orders = await Order.find({ permanentId });

    // Check if any orders exist
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for the given permanentId' });
    }

    // Return the orders data
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by permanentId:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
