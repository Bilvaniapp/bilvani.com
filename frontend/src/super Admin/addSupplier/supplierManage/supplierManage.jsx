import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../admin-component/admin-internal/admin-header/admin-header';
import { BASE_URL } from '../../../helper/helper';
import './supplierManage.css';
import { FaPen, FaTimes } from 'react-icons/fa';

const SupplierManage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token'))
        ?.split('=')[1];

      if (!token) {
        setErrorMessage('Token is not provided in cookies');
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/bilvani/admin/suppliers/get/all`, {
        withCredentials: true,
      });

      if (response.data.suppliers) {
        setSuppliers(response.data.suppliers);
        setFilteredSuppliers(response.data.suppliers);
      } else {
        setErrorMessage('No suppliers found.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to fetch suppliers. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterSuppliers(value, filterState);
  };

  const handleFilterState = (e) => {
    const value = e.target.value;
    setFilterState(value);
    filterSuppliers(searchTerm, value);
  };

  const filterSuppliers = (searchValue, stateValue) => {
    const filtered = suppliers.filter(
      (supplier) =>
        (supplier.companyName?.toLowerCase().includes(searchValue) ||
          supplier.phoneNo?.toLowerCase().includes(searchValue)) &&
        (stateValue ? supplier.state === stateValue : true)
    );
    setFilteredSuppliers(filtered);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier({ ...supplier });
    setModalOpen(true);
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`${BASE_URL}/api/bilvani/admin/delete/supplier/${supplierId}`);
        setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
        setFilteredSuppliers(filteredSuppliers.filter((supplier) => supplier._id !== supplierId));
      } catch (error) {
        setErrorMessage('Failed to delete supplier. Please try again.');
      }
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedSupplier = await axios.put(
        `${BASE_URL}/api/bilvani/admin/update/supplier/${editingSupplier._id}`,
        editingSupplier
      );
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === editingSupplier._id ? updatedSupplier.data.supplier : supplier
        )
      );
      setFilteredSuppliers(
        filteredSuppliers.map((supplier) =>
          supplier._id === editingSupplier._id ? updatedSupplier.data.supplier : supplier
        )
      );
      setModalOpen(false);
      alert('Supplier updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update supplier. Please try again.');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="sm-container putHeader">
      <AdminHeader />
      <div className="sm-inner-container">
        <h2 className="sm-title">Supplier Details</h2>



        <div className="sm-search-container">
          <input
            type="text"
            placeholder="Search by Company Name or Phone No"
            value={searchTerm}
            onChange={handleSearch}
            className="sm-search-bar"
          />

        </div>


        <div>
        <div className=''>
            <select
              className="sm-filter-dropdown"
              value={filterState}
              onChange={handleFilterState}
            >
              <option value="">Filter by State</option>
              {[...new Set(suppliers.map((supplier) => supplier.state))].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>




        {errorMessage && <p className="sm-error-message">{errorMessage}</p>}
        <div className="sm-table-wrapper">
          {filteredSuppliers.length > 0 ? (
            <table className="sm-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.companyName}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phoneNo}</td>
                    <td>{supplier.state}</td>
                    <td>
                      <div className="sm-actions">
                        <FaPen
                          className="sm-icon sm-edit-icon"
                          onClick={() => handleEdit(supplier)}
                        />
                        <FaTimes
                          className="sm-icon sm-delete-icon"
                          onClick={() => handleDelete(supplier._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="sm-no-data">No suppliers available</p>
          )}
        </div>
      </div>

      {modalOpen && editingSupplier && (
        <div className="sm-modal-overlay">
          <div className="sm-modal-content">
            <h3 className="sm-modal-title">Edit Supplier</h3>

            <div className="grid-suppliers">
              <form>
                {/* Grid container for form fields */}
                <div className="sm-modal-form-grid">
                  {Object.entries(editingSupplier).map(([key, value]) => (
                    !['_id', 'token', 'createdAt', 'updatedAt', '__v'].includes(key) && (
                      <div key={key} className="form-field">
                        <label className="form-label">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={value || ''}
                          onChange={handleModalChange}
                          className="sm-input"
                        />
                      </div>
                    )
                  ))}
                </div>

                <div className="saveandcancelbtn">
                  <button type="button" onClick={handleSave} className="sm-btn sm-save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="sm-btn sm-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManage;
