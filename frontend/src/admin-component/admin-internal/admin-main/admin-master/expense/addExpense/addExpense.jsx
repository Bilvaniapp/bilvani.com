import React, { useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import './addExpense.css';

const AddExpense = () => {
  const [expenseData, setExpenseData] = useState({
    date: '',
    expenseType: '',
    paymentMode: '',
    paidBy: '',
    remarks: '',
  });

  const paymentModes = ['cash', 'cheque', 'cardPayment', 'mobileWallet', 'demandDraft', 'bankTransfer'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/bilvani/admin/create/expense`, expenseData, {
        withCredentials: true, // To include cookies in the request
      });

      alert(response.data.message);

      // Reset the fields after successful submission
      setExpenseData({
        date: '',
        expenseType: '',
        paymentMode: '',
        paidBy: '',
        remarks: '',
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense");
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h1 className="addexpense-m-title1">Add Expense</h1>

        <form className="addexpense-m-form" onSubmit={handleSubmit}>
          <div className="addexpense-m-form-group">
            <label className="addexpense-m-label">Date:</label>
            <input
              className="addexpense-m-input"
              type="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="addexpense-m-form-group">
            <label className="addexpense-m-label">Expense Type:</label>
            <input
              className="addexpense-m-input"
              type="text"
              name="expenseType"
              value={expenseData.expenseType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="addexpense-m-form-group">
            <label className="addexpense-m-label">Payment Mode:</label>
            <select
              className="addexpense-m-select"
              name="paymentMode"
              value={expenseData.paymentMode}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div className="addexpense-m-form-group">
            <label className="addexpense-m-label">Paid By:</label>
            <input
              className="addexpense-m-input"
              type="text"
              name="paidBy"
              value={expenseData.paidBy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="addexpense-m-form-group">
            <label className="addexpense-m-label">Remarks:</label>
            <textarea
              className="addexpense-m-textarea"
              name="remarks"
              value={expenseData.remarks}
              onChange={handleChange}
            />
          </div>
          <button className="addexpense-m-button" type="submit">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
