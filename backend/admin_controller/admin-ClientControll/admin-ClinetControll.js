const Client = require('../../admin_Monogdb/adminClientMongo/adminClientMongo');
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');

exports.createClient = async (req, res) => {
  try {
    const { password, ...clientData } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new client object with the hashed password
    const client = new Client({
      ...clientData,
      password: hashedPassword,
    });

    // Save the client to the database
    await client.save();

    // Generate a JWT token
    const token = jwt.sign({ clientId: client._id, role: client.category }, process.env.JWT_SECRET);

    // Assign the token to the client object
    client.token = token;

    // Save the client again to include the token
    await client.save();

    // Send a success response
    res.status(201).json({
      message: 'Client successfully created!'
      
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(400).json({ error: error.message });
  }
};



// Update client by ID
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client updated successfully', client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete client by ID
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





// Get all clients
exports.getAllClients = async (req, res) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get client by ID
  exports.getClientById = async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  

// Fetch clients by category 'A' with clientId and fullname only
exports.getClientsByCategoryA = async (req, res) => {
  try {
    // Find clients with category 'A' and project only clientId and fullname
    const clients = await Client.find({ category: 'A' })
      .select('clientId fullName'); // Select only the required fields

    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


