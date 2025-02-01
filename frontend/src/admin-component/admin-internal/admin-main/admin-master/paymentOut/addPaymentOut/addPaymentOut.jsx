import React, { useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import './addPaymentOut.css'


const AddPaymentOut = () => {
  const [paymentData, setPaymentData] = useState({
    date: '',
    supplierName: '',
    purchaseBillNo: '',
    paymentStatus: 'pending', // Default to pending
    amount: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/bilvani/admin/create/paymentout`, paymentData, {
        withCredentials: true, // To include cookies in the request
      });

      // Show an alert on success
      alert(response.data.message);

      setPaymentData({
        date: '',
        supplierName: '',
        purchaseBillNo: '',
        paymentStatus: 'pending',
        amount: '',
        remarks: '',
      });
    } catch (error) {
      console.error("Error creating payment out:", error);
      setError("Failed to create payment out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h2 className="addpaymentout-header">Add Payment Out</h2>

        {/* Display error message */}
        {error && <div className="addpaymentout-alert addpaymentout-alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="addpaymentout-form">
          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Date</label>
            <input
              type="date"
              name="date"
              value={paymentData.date}
              onChange={handleInputChange}
              required
              className="addpaymentout-input"
            />
          </div>

          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Supplier Name</label>
            <input
              type="text"
              name="supplierName"
              value={paymentData.supplierName}
              onChange={handleInputChange}
              required
              className="addpaymentout-input"
            />
          </div>

          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Purchase Bill No</label>
            <input
              type="text"
              name="purchaseBillNo"
              value={paymentData.purchaseBillNo}
              onChange={handleInputChange}
              required
              className="addpaymentout-input"
            />
          </div>

          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Payment Status</label>
            <select
              name="paymentStatus"
              value={paymentData.paymentStatus}
              onChange={handleInputChange}
              className="addpaymentout-input"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Amount</label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleInputChange}
              required
              className="addpaymentout-input"
            />
          </div>

          <div className="addpaymentout-form-group">
            <label className="addpaymentout-label">Remarks</label>
            <textarea
              name="remarks"
              value={paymentData.remarks}
              onChange={handleInputChange}
              className="addpaymentout-textarea"
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="addpaymentout-button">
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentOut;
