const express = require("express");
const { contact,deleteContact, getContacts } = require("../../controller/contactUsControl/contactUsControl");

const router = express.Router();


router.route('/api/contact-us').post(contact);

// Route to handle deleting a contact form by ID (DELETE request)
router.route('/api/contact/delete/:id').delete(deleteContact);
router.route('/api/bilvani/getall/contact').get(getContacts);

module.exports = router;