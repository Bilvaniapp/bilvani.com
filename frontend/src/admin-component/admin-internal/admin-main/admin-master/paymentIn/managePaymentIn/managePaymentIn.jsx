import React, { useState, useEffect } from 'react';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import axios from 'axios';
import './managePaymentIn.css'; // Assuming you'll create a CSS file for the styles

const ManagePaymentIn = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bilvani/admin/getall/paymentIn`, {
        withCredentials: true,
      });

      if (response.data && response.data.payments) {
        setPayments(response.data.payments);
        setFilteredPayments(response.data.payments);
      } else {
        setErrorMessage('No payments found.');
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setErrorMessage('Failed to fetch payments. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterPayments(value, filterType);
  };

  const handleFilterTypeChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    filterPayments(searchTerm, value);
  };

  const filterPayments = (searchValue, typeFilter) => {
    const filtered = payments.filter((payment) => {
      const matchesSearch =
        payment.clientName?.toLowerCase().includes(searchValue) ||
        payment.invoiceNo?.toLowerCase().includes(searchValue);
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'GST' && payment.invoiceNo.startsWith('GST')) ||
        (typeFilter === 'INVC' && payment.invoiceNo.startsWith('INVC'));
      return matchesSearch && matchesType;
    });
    setFilteredPayments(filtered);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="manage-payment-m putHeader">
      <AdminHeader />
      <div className="container">
        <h2 className="manage-title-m">Manage Payments</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by Client Name or Invoice No"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar-m"
          />

          <label htmlFor="" style={{marginLeft:'25px'}}>Filter By InvoiceType:</label>
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="type-filter-m"
          >
            <option value="all">All</option>
            <option value="GST">GST</option>
            <option value="INVC">INVC</option>
          </select>
        </div>
        {errorMessage && <p className="error-m">{errorMessage}</p>}
        <div className="payment-table-m">
          {filteredPayments.length > 0 ? (
            <table className="payment-table-content-m">
              <thead className="table-header-m">
                <tr className="table-row-m">
                  <th>Contact No</th>
                  <th>Client Name</th>
                  <th>Invoice No</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="payment-row-m">
                    <td>{payment.contactNo}</td>
                    <td>{payment.customerName}</td>
                    <td>{payment.invoiceNo}</td>
                    <td>{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-payments-m">No payments available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePaymentIn;
