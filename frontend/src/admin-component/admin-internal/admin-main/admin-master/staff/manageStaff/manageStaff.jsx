import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import './manageStaff.css';
import { FaPen, FaTimes } from 'react-icons/fa';

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch staff members from the backend
  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bilvani/admin/getall/staff`, {
        withCredentials: true,
      });
      setStaffList(response.data.staffMembers);
      setFilteredStaff(response.data.staffMembers);
    } catch (error) {
      setErrorMessage('Failed to fetch staff members. Please try again.');
    }
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterStaff(value, statusFilter);
  };

  // Handle status filter changes
  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterStaff(searchTerm, value);
  };

  // Filter staff based on search term and status
  const filterStaff = (searchValue, statusValue) => {
    const filtered = staffList.filter(
      (staff) =>
        (staff.name?.toLowerCase().includes(searchValue) ||
          staff.email?.toLowerCase().includes(searchValue) ||
          staff.designation?.toLowerCase().includes(searchValue)) &&
        (statusValue === '' || staff.status === statusValue)
    );
    setFilteredStaff(filtered);
  };

  // Handle editing staff member
  const handleEdit = (staff) => {
    setEditingStaff({ ...staff });
    setModalOpen(true);
  };

  // Handle deleting staff member
  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`${BASE_URL}/api/bilvani/admin/delete/staff/${staffId}`, {
          withCredentials: true,
        });
        setStaffList(staffList.filter((staff) => staff._id !== staffId));
        setFilteredStaff(filteredStaff.filter((staff) => staff._id !== staffId));
      } catch (error) {
        setErrorMessage('Failed to delete staff member. Please try again.');
      }
    }
  };

  // Handle changes in the modal input fields
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff((prev) => ({ ...prev, [name]: value }));
  };


  // Handle saving the updated staff member
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const updatedStaffData = { ...editingStaff };
      if (newPassword) {
        updatedStaffData.password = newPassword; // Add password change if provided
      }

      const updatedStaff = await axios.put(
        `${BASE_URL}/api/bilvani/admin/update/staff/${editingStaff._id}`,
        updatedStaffData,
        { withCredentials: true }
      );

      setStaffList(
        staffList.map((staff) =>
          staff._id === editingStaff._id ? updatedStaff.data.staff : staff
        )
      );
      setFilteredStaff(
        filteredStaff.map((staff) =>
          staff._id === editingStaff._id ? updatedStaff.data.staff : staff
        )
      );
      setModalOpen(false);
      alert('Staff member updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update staff member. Please try again.');
    }
  };

  // Fetch staff data on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h2>Manage Staff</h2>
        <div className="search-filter-container-managestaff">
          <input
            type="text"
            placeholder="Search by Name, Email or Designation"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar-managestaff"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="status-filter-managestaff"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Quit">Quit</option>
          </select>
        </div>
        {errorMessage && <p className="error-managestaff">{errorMessage}</p>}
        <div className="staff-table-managestaff">
          {filteredStaff.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff._id}>
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{staff.designation}</td>
                    <td>{staff.status}</td>
                    <td>
                      <div className="iconofEdit-managestaff">
                        <FaPen
                          className="icon-managestaff edit-icon-managestaff"
                          onClick={() => handleEdit(staff)}
                        />
                        <FaTimes
                          className="icon-managestaff delete-icon-managestaff"
                          onClick={() => handleDelete(staff._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No staff members available</p>
          )}
        </div>
      </div>

      {modalOpen && editingStaff && (
        <div className="modal-managestaff">
          <div className="modal-content-managestaff">
            <h3>Edit Staff</h3>
            <form>
              <div className="modelcenter-managestaff">
                <div className="updateStaffBox-managestaff">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editingStaff.name || ''}
                    onChange={handleModalChange}
                    placeholder="Name"
                    className="staffname1-managestaff"
                  />
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editingStaff.email || ''}
                    onChange={handleModalChange}
                    placeholder="Email"
                    className="emailstaff1-managestaff"
                  />

                  <label>Designation:</label>
                  <select
                    name="designation"
                    value={editingStaff.designation || ''}
                    onChange={handleModalChange}
                    className="designation1-managestaff"
                  >
                    <option value="">Select Designation</option>
                    <option value="General Manager">General Manager</option>
                    <option value="Area Manager">Area Manager</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales and Services">Sales and Services</option>
                    <option value="HR and Admin">HR and Admin</option>
                    <option value="Finance">Finance</option>
                  </select>

                  <label>Status:</label>
                  <select
                    name="status"
                    value={editingStaff.status || ''}
                    onChange={handleModalChange}
                    className="status1-managestaff"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Quit">Quit</option>
                  </select>


                  <label>Joining Date:</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={editingStaff.joiningDate || ''}
                    onChange={handleModalChange}
                    placeholder="Joining Date"
                  />
                  <label>Gender:</label>
                  <select
                    name="gender"
                    value={editingStaff.gender || ''}
                    onChange={handleModalChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editingStaff.address || ''}
                    onChange={handleModalChange}
                    placeholder="Address"
                  />
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    value={editingStaff.dob || ''}
                    onChange={handleModalChange}
                  />
                  <label>Pan Card:</label>
                  <input
                    type="text"
                    name="panCard"
                    value={editingStaff.panCard || ''}
                    onChange={handleModalChange}
                    placeholder="Pan Card"
                  />
                  <label>Aadhaar Card:</label>
                  <input
                    type="text"
                    name="aadhaarCard"
                    value={editingStaff.aadhaarCard || ''}
                    onChange={handleModalChange}
                    placeholder="Aadhaar Card"
                  />

                  <label>Remark:</label>
                  <input
                    type="text"
                    name="remark"
                    value={editingStaff.remark || ''}
                    onChange={handleModalChange}
                    placeholder="Remark"
                  />
                  {/* Password Fields */}
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <label>Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="modal-buttons-managestaff">
                <button type="button" onClick={handleSave} className="save-btn-managestaff">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cancel-btn-managestaff"
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

export default ManageStaff;
