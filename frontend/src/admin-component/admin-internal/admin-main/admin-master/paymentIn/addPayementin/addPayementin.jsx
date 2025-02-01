import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../../../admin-header/admin-header";
import { BASE_URL } from "../../../../../../helper/helper";
import "./addPayementin.css"; // Add a CSS file for unique class styling

const AddPaymentIn = () => {
  const [formData, setFormData] = useState({
    contactNo: "",
    clientName: "",
    date: new Date().toISOString().split("T")[0], // Default to current date
    invoiceNo: "",
    paymentStatus: "paid", // Default to "paid"
    amount: "",
    remarks: "",
    id: "",
  });

  const [invoiceNumbers, setInvoiceNumbers] = useState([]); // List of available invoice numbers

  useEffect(() => {
    if (formData.contactNo) {
      fetchInvoiceByContactNo(formData.contactNo);
    }
  }, [formData.contactNo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchInvoiceByContactNo = async (contactNo) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/admin/get/invoice/bycontact/${contactNo}`,
        { withCredentials: true }
      );

      const invoices = response.data.invoices || [];
      if (invoices.length > 0) {
        setInvoiceNumbers(
          invoices.map((invoice) => ({
            number: invoice.invoiceNo,
            id: invoice._id,
            totalAmount: invoice.totalamount,
          }))
        );
        setFormData((prevFormData) => ({
          ...prevFormData,
          clientName:
            invoices[0].clientName || invoices[0].customerName || "",
          remarks: invoices[0].remarks || "",
          id: "",
        }));
      } else {
        setInvoiceNumbers([]);
        alert("No invoices found for the provided contact number.");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setFormData({
        contactNo: "",
        clientName: "",
        date: new Date().toISOString().split("T")[0], // Reset to default date
        invoiceNo: "",
        paymentStatus: "paid", // Reset to default payment status
        amount: "",
        remarks: "",
        id: "",
      });
      setInvoiceNumbers([]);
    }
  };

  const updateInvoicePaymentStatus = async (invoiceId, paymentStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/bilvani/admin/update/invoices/${invoiceId}`,
        { paymentStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Invoice payment status updated successfully.");
      } else {
        alert("Failed to update invoice payment status.");
      }
    } catch (err) {
      console.error("Error updating invoice payment status:", err);
      alert("Error updating invoice payment status: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentStatus === "paid" && formData.id) {
      await updateInvoicePaymentStatus(formData.id, "Paid");
    }

    try {
      await axios.post(
        `${BASE_URL}/api/bilvani/admin/create/paymentIn`,
        { ...formData, customerName: formData.clientName },
        { withCredentials: true }
      );

      alert(
        "Payment In created successfully, and Invoice payment status updated."
      );
      setFormData({
        contactNo: "",
        clientName: "",
        date: new Date().toISOString().split("T")[0], // Reset to default date
        invoiceNo: "",
        paymentStatus: "paid", // Reset to default payment status
        amount: "",
        remarks: "",
        id: "",
      });
      setInvoiceNumbers([]);
    } catch (err) {
      console.error("Error creating payment:", err);
      alert("Error occurred while submitting payment.");
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h2 className="form-title-addpayment-m">Add Payment In</h2>
        <form onSubmit={handleSubmit} className="payment-form-addpayment-m">
          <div className="form-group-addpayment-m">
            <label htmlFor="contactNo">Contact Number:</label>
            <input
              type="text"
              id="contactNo"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="clientName">Client Name:</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              disabled
            />
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="invoiceNo">Invoice Number:</label>
            <select
              id="invoiceNo"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={(e) => {
                const selectedInvoiceNo = e.target.value;
                const selectedInvoice = invoiceNumbers.find(
                  (invoice) => invoice.number === selectedInvoiceNo
                );
                setFormData({
                  ...formData,
                  invoiceNo: selectedInvoiceNo,
                  id: selectedInvoice?.id || "",
                  amount: selectedInvoice?.totalAmount || "",
                });
              }}
              required
            >
              <option value="">Select Invoice</option>
              {invoiceNumbers.map((invoice) => (
                <option key={invoice.id} value={invoice.number}>
                  {invoice.number}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="paymentStatus">Payment Status:</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-addpayment-m">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="submit-button-addpayment-m">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentIn;
