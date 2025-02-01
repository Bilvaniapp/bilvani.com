const Contact = require('../../mongodb/contactUsMongo/contactUsMongo');


exports.contact = async (req, res) => {
    try {
    
        const { name, email, message, subject } = req.body;
    
        
        const newContact = new Contact({
          name,
          email,
          message,
          subject
        });
    
       
        await newContact.save();
    
     
        res.status(201).json({ message: 'Contact form submitted successfully!' });
      } catch (error) {
       
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
};



// DELETE API to remove a contact form entry by ID
exports.deleteContact = async (req, res) => {
  try {
      const { id } = req.params;  // Get the contact form ID from the request parameters

      // Find and delete the contact entry by its ID
      const deletedContact = await Contact.findByIdAndDelete(id);

      if (!deletedContact) {
          return res.status(404).json({ error: 'Contact form not found!' });
      }

      // Successfully deleted the contact form
      res.status(200).json({ message: 'Contact form deleted successfully!' });
  } catch (error) {
      console.error('Error deleting contact form:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

// GET API to retrieve all contact form entries
exports.getContacts = async (req, res) => {
  try {
      // Fetch all contact form entries from the database
      const contacts = await Contact.find();

      // Check if there are any contacts in the database
      if (contacts.length === 0) {
          return res.status(404).json({ message: 'No contact forms found.' });
      }

      // Return the contact forms
      res.status(200).json(contacts);
  } catch (error) {
      console.error('Error retrieving contact forms:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
