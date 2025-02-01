const express = require('express');
const router = express.Router();
const clientController = require('../../admin_controller/admin-ClientControll/admin-ClinetControll');

// Route to create a new client
router.post('/api/admin/client/create', clientController.createClient);



// Route to update a client by ID
router.put('/api/admin/client/update/:id', clientController.updateClient);

// Route to delete a client by ID
router.delete('/api/admin/client/delete/:id', clientController.deleteClient);



// Route to get all clients
router.get('/api/admin/get/all/client', clientController.getAllClients);

// GET clients by category A
router.get('/api/client/categoryA', clientController.getClientsByCategoryA);


// Route to get a client by ID
router.get('/:id', clientController.getClientById);




module.exports = router;
