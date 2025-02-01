import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import axios from 'axios';
import './managePaymentOut.css'

const ManagePaymentOut = () => {
  const [paymentOuts, setPaymentOuts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentOuts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bilvani/admin/getall/paymentout`, {
          withCredentials: true // This ensures cookies are sent with the request
        });
        setPaymentOuts(response.data.paymentOuts);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching payment outs');
      }
    };

    fetchPaymentOuts();
  }, []);

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        {error && <p className="managepaymentoutError">{error}</p>}
        <h2 className="managepaymentoutTitle">Manage Payment Outs</h2>
        <table className="managepaymentoutTable">
          <thead>
            <tr className="managepaymentoutTableHeaderRow">
              <th className="managepaymentoutTableHeader">Date</th>
              <th className="managepaymentoutTableHeader">Supplier Name</th>
              <th className="managepaymentoutTableHeader">Purchase Bill No</th>
              <th className="managepaymentoutTableHeader">Payment Status</th>
              <th className="managepaymentoutTableHeader">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paymentOuts.map((paymentOut) => (
              <tr key={paymentOut._id} className="managepaymentoutTableRow">
                <td className="managepaymentoutTableCell">{new Date(paymentOut.date).toLocaleDateString()}</td>
                <td className="managepaymentoutTableCell">{paymentOut.supplierName}</td>
                <td className="managepaymentoutTableCell">{paymentOut.purchaseBillNo}</td>
                <td className="managepaymentoutTableCell">{paymentOut.paymentStatus}</td>
                <td className="managepaymentoutTableCell">{paymentOut.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePaymentOut;
