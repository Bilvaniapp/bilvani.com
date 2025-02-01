import React, { useState, useEffect } from 'react';
import AdminHeader from '../../admin-component/admin-internal/admin-header/admin-header';
import { BASE_URL } from '../../helper/helper';
import { FaTrash } from 'react-icons/fa'; // Importing an icon for delete action
import './contact.css'
const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);

  // Fetch contacts when component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/bilvani/getall/contact`);
        const data = await response.json();
       

        // Assuming response contains a 'contacts' field that holds the array
        if (data.contacts) {
          setContacts(data.contacts);
        } else {
          setContacts(data);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // Function to handle delete request
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/bilvani/delete/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContacts(contacts.filter(contact => contact._id !== id));
      } else {
        console.error("Failed to delete contact.");
      }
    } catch (error) {
      console.error("Error while deleting contact:", error);
    }
  };

  return (
    <div className='putHeader'>
      <AdminHeader />
      <div className='container'>
        <h1 className='admincontact-header'>Admin Contact</h1>
        <table className='admincontact-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="5" className='admincontact-empty-row'>No contacts found</td>
              </tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>
                  <td className='admincontact-action'>
                    <button 
                      className='admincontact-delete-icon' 
                      onClick={() => handleDelete(contact._id)}
                      title='Delete Contact'>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactAdmin;