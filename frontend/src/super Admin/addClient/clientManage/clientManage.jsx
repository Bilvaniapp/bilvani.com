import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../admin-component/admin-internal/admin-header/admin-header';
import { BASE_URL } from '../../../helper/helper';
import './clientManage.css';
import { FaPen, FaTimes } from 'react-icons/fa';

const ClientManage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryAClients, setCategoryAClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/get/all/client`);
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch clients. Please try again.');
    }
  };

  const fetchCategoryAClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/client/categoryA`);
      setCategoryAClients(response.data || []);
    } catch (error) {
      setErrorMessage('Failed to fetch Category A clients.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterClients(value, categoryFilter);
  };

  const handleCategoryFilter = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    filterClients(searchTerm, value);
  };

  const filterClients = (searchValue, categoryValue) => {
    const filtered = clients.filter(
      (client) =>
        (client.clientId?.toLowerCase().includes(searchValue) ||
          client.fullName?.toLowerCase().includes(searchValue)) &&
        (categoryValue === '' || client.category === categoryValue)
    );
    setFilteredClients(filtered);
  };

  const handleEdit = (client) => {
    setEditingClient({ ...client });
    setModalOpen(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`${BASE_URL}/api/admin/client/delete/${clientId}`);
        setClients(clients.filter((client) => client._id !== clientId));
        setFilteredClients(filteredClients.filter((client) => client._id !== clientId));
      } catch (error) {
        setErrorMessage('Failed to delete client. Please try again.');
      }
    }
  };

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    if (name === 'category') {
      setEditingClient((prev) => ({
        ...prev,
        category: value,
        underCategory: '',
      }));
    } else {
      setEditingClient((prev) => ({ ...prev, [name]: updatedValue }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedClient = await axios.put(
        `${BASE_URL}/api/admin/client/update/${editingClient._id}`,
        editingClient
      );
      setClients(
        clients.map((client) =>
          client._id === editingClient._id ? updatedClient.data.client : client
        )
      );
      setFilteredClients(
        filteredClients.map((client) =>
          client._id === editingClient._id ? updatedClient.data.client : client
        )
      );
      setModalOpen(false);
      alert('Client updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update client. Please try again.');
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCategoryAClients();
  }, []);

  return (
    <div className="client-manage putHeader">
      <AdminHeader />
      <div className="container">
        <h2>Client Details</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by Client ID or Name"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="client-table">
          {filteredClients.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Under Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.clientId}</td>
                    <td>{client.fullName}</td>
                    <td>{client.email}</td>
                    <td>{client.category}</td>
                    <td>{client.underCategory || 'Super Admin'}</td>
                    <td>
                      <div className='iconofEdit'>

                      <FaPen
                        className="icon edit-icon"
                        onClick={() => handleEdit(client)}
                      />
                      <FaTimes
                        className="icon delete-icon"
                        onClick={() => handleDelete(client._id)}
                      />

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No clients available</p>
          )}
        </div>
      </div>

      {modalOpen && editingClient && (
  <div className="modal-m">
    <div className="modal-content-m">
      <h3>Edit Client</h3>
      <form>


        <div className='modelcenter'>
          {/* First Row */}
        <div className="updateClientBox">
          <label>Client Name:</label>
          <input
            type="text"
            name="fullName"
            value={editingClient.fullName || ''}
            onChange={handleModalChange}
            placeholder="Full Name"
            className='clientname1'
          />
          <label>Client ID:</label>
          <input
            type="text"
            name="clientId"
            value={editingClient.clientId || ''}
            onChange={handleModalChange}
            placeholder="Client ID"
            className='clientid1'
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editingClient.email || ''}
            onChange={handleModalChange}
            placeholder="Email"
            className='emailclient1'
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phoneNo"
            value={editingClient.phoneNo || ''}
            onChange={handleModalChange}
            placeholder="Phone No"
            className='phoneclient1'
          />
        </div>

        {/* Second Row */}
        <div className="updateClientBox">
          <label>Store Address:</label>
          <input
            type="text"
            name="billingAddress"
            value={editingClient.billingAddress || ''}
            onChange={handleModalChange}
            placeholder="Store Address"
            className='store1'
          />
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={editingClient.city || ''}
            onChange={handleModalChange}
            placeholder="City"
            className='city1'
          />
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={editingClient.state || ''}
            onChange={handleModalChange}
            placeholder="State"
            className='state1'
          />
          <label>Pin Code:</label>
          <input
            type="text"
            name="pinCode"
            value={editingClient.pinCode || ''}
            onChange={handleModalChange}
            placeholder="Pin Code"
            className='pincode1'
          />
        </div>

        {/* Third Row */}
        <div className="updateClientBox">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={editingClient.country || 'India'}
            onChange={handleModalChange}
            placeholder="Country"
            className='country1'
          />
          <label>PAN No:</label>
          <input
            type="text"
            name="panNo"
            value={editingClient.panNo || ''}
            onChange={handleModalChange}
            placeholder="PAN No"
            className='panno1'
          />
          <label>GST No:</label>
          <input
            type="text"
            name="gstin"
            value={editingClient.gstin || ''}
            onChange={handleModalChange}
            placeholder="GSTIN"
            className='gstno1'
          />
        </div>

        {/* Fourth Row */}
        <div className="updateClientBox">
          <label>Opening Balance:</label>
          <input
            type="number"
            name="openingBalance"
            value={editingClient.openingBalance || ''}
            onChange={handleModalChange}
            placeholder="Opening Balance"
            className='opening1'
          />

          <label>Balance Type:</label>
          <select
            name="type"
            value={editingClient.type || ''}
            onChange={handleModalChange}
            className='optionbalance'
          >
            <option value="">Select Type</option>
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>
          <label>Category:</label>
          <select
            name="category"
            value={editingClient.category || ''}
            onChange={handleModalChange}
            className='category11'
          >
            <option value="">Select Category</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          {['B', 'C', 'D'].includes(editingClient.category) && (
            <select
              name="underCategory"
              value={editingClient.underCategory || ''}
              onChange={handleModalChange}
              className='undercategory1'

            >
              <option value="">Select Under Category</option>
              {categoryAClients.map((client) => (
                <option key={client._id} value={client.fullName}>
                  {client.fullName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Fifth Row */}
        <div className="updateClientBox">
          <label>Remark:</label>
          <textarea
            name="remark"
            value={editingClient.remark || ''}
            onChange={handleModalChange}
            placeholder="Remark"
            style={{ gridColumn: 'span 2' }}
            className='remark1'
          ></textarea>
        </div>
        </div>

        {/* Buttons */}
        <div className="modal-buttons-m">
          <button type="button" onClick={handleSave} className="save-btn-m">
            Save
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="cancel-btn-m"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default ClientManage;
