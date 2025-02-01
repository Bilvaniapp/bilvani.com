import React, { useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../admin-component/admin-internal/admin-header/admin-header';
import { BASE_URL } from '../../../helper/helper';
import './newSupplier.css';

const NewSupplier = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    storeAddress: '',
    city: '',
    state: '',
    pinCode: '',
    email: '',
    phoneNo: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    panNo: '',
    gstNo: '',
    remark: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Send form data with token in cookies
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/admin/create/supplier`,
        formData,
        { withCredentials: true } // Ensure credentials are sent with the request
      );

      // Successful submission
      alert('Supplier information has been successfully saved!');
      setFormData({
        companyName: '',
        storeAddress: '',
        city: '',
        state: '',
        pinCode: '',
        email: '',
        phoneNo: '',
        accountNumber: '',
        bankName: '',
        branchName: '',
        ifscCode: '',
        panNo: '',
        gstNo: '',
        remark: '',
      });
    } catch (error) {
      // Handle errors
      setErrorMessage(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container-1 container">
        <h4 className="supplier-heading">Create New Supplier</h4>

        {errorMessage && <div className="error-message-supplier">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="grid-form-supplier">
          <div className="form-field-supplier">
            <label className="label-supplier">Company Name:</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Store Address:</label>
            <input type="text" name="storeAddress" value={formData.storeAddress} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">State:</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Pin Code:</label>
            <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Phone No:</label>
            <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Account Number:</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Bank Name:</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Branch Name:</label>
            <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">IFSC Code:</label>
            <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">PAN No:</label>
            <input type="text" name="panNo" value={formData.panNo} onChange={handleChange} />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">GST No:</label>
            <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} />
          </div>

          <div className="form-field-supplier">
            <label className="label-supplier">Remark:</label>
            <textarea name="remark" value={formData.remark} onChange={handleChange}></textarea>
          </div>

          <div className="form-field-supplier" style={{ gridColumn: 'span 3', textAlign: 'center' }}>
            <button className="btn-supplier" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSupplier;
