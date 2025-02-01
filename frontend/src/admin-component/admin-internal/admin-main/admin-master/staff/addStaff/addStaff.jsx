import React, { useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import './addStaff.css';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    designation: '',
    address: '',
    mobile: '',
    dob: '',
    panCard: '',
    aadhaarCard: '',
    email: '',
    password: '',
    status: 'Active', // default value
    remark: '',
    joiningDate: '', // Added joiningDate field
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${BASE_URL}/api/bilvani/admin/create/staff`, formData, {
        withCredentials: true, // To include cookies in the request
      });

      alert('Staff member created successfully!');
      setFormData({
        name: '',
        gender: '',
        designation: '',
        address: '',
        mobile: '',
        dob: '',
        panCard: '',
        aadhaarCard: '',
        email: '',
        password: '',
        status: 'Active',
        remark: '',
        joiningDate: '', // Reset joiningDate field
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h2>Add Staff Member</h2>
        {error && <div className="addstaff-error-message">{error}</div>}
        {success && <div className="addstaff-success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="addstaff-form">
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Designation:
            <select name="designation" value={formData.designation} onChange={handleChange} required>
              <option value="">Select Designation</option>
              <option value="General Manager">General Manager</option>
              <option value="Area Manager">Area Manager</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales and Services">Sales and Services</option>
              <option value="HR and Admin">HR and Admin</option>
              <option value="Finance">Finance</option>
            </select>
          </label>
          <label>
            Address:
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </label>
          <label>
            Mobile:
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </label>
          <label>
            Date of Birth:
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </label>
          <label>
            Joining Date: {/* New field */}
            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
          </label>
          <label>
            PAN Card:
            <input type="text" name="panCard" value={formData.panCard} onChange={handleChange} required />
          </label>
          <label>
            Aadhaar Card:
            <input type="text" name="aadhaarCard" value={formData.aadhaarCard} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Quit">Quit</option>
            </select>
          </label>
          <label>
            Remark:
            <textarea name="remark" value={formData.remark} onChange={handleChange} />
          </label>
          
          <button type="submit" className="addstaff-submit-button">Add Staff</button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
