import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../../helper/helper";
import "./newInvoice.css";
import AdminHeader from "../../../../admin-header/admin-header";
import { Navigate, useNavigate } from "react-router-dom";

const NewInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: "",
    invoiceNo: "",
    date: "",
    placeOfSupply: "",
    billingType: "Cash A/C",
    contactNo: "",
    clientName: "",
    address: "",
    clientGSTIN: "",
    deliveryTerms: "",
    paymentStatus: "", // Default value
  });

  useEffect(() => {
    if (invoiceData.billingType === "Cash A/C") {
      setInvoiceData((prevData) => ({
        ...prevData,
        clientName: "Cash", // Set default client name when "Cash A/C" is selected
      }));
    } else if (invoiceData.billingType === "Client A/C") {
      setInvoiceData((prevData) => ({
        ...prevData,
        clientName: "", // Clear client name when "Client A/C" is selected
      }));
    }
  }, [invoiceData.billingType]); // Runs when billingType changes

  const [particulars, setParticulars] = useState([
    {
      itemName: "",
      quantity: 1,
      salePrice: 0.0,
      discountPercent: 0,
      taxPercent: 0,
      gstamount: 0.0,
      amount: 0.0,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
  };

  const handleParticularChange = (index, field, value) => {
    const updatedParticulars = particulars.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate the amount and gstamount
        const discountedPrice =
          updatedItem.salePrice -
          (updatedItem.salePrice * updatedItem.discountPercent) / 100;
        const taxAmount = (discountedPrice * updatedItem.taxPercent) / 100;
        updatedItem.amount =
          updatedItem.quantity * (discountedPrice + taxAmount);

        // Calculate GST amount
        updatedItem.gstamount = (taxAmount * updatedItem.quantity).toFixed(2); // GST per item

        return updatedItem;
      }
      return item;
    });

    setParticulars(updatedParticulars);

    // Update total amount in invoiceData
    const { totalAmount } = calculateTotals();
    setInvoiceData((prevData) => ({
      ...prevData,
      totalamount: totalAmount.toFixed(2), // Set the total amount in invoice data
    }));
  };

  const addParticularRow = () => {
    setParticulars([
      ...particulars,
      {
        itemName: "",
        quantity: 1,
        salePrice: 0.0,
        discountPercent: 0,
        taxPercent: 0,
        gstamount: 0.0,
        amount: 0.0,
      },
    ]);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { totalAmount } = calculateTotals();
    
    // Ensure the date is included, defaulting to the current date if not selected
    const finalInvoiceData = {
      ...invoiceData,
      particulars: particulars,
      totalamount: totalAmount.toFixed(2),
      date: invoiceData.date || new Date().toISOString().split("T")[0], // Default to current date if not provided
    };
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/admin/create/invoices`,
        finalInvoiceData,
        {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        // Assuming successful response status is 200
        Navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error creating invoice:", error.message);
    }
  };
  

  const removeParticularRow = (index) => {
    if (particulars.length > 1) {
      const updatedParticulars = particulars.filter((_, i) => i !== index);
      setParticulars(updatedParticulars);
    } else {
      alert("The table must have at least one row."); // Optional: Alert message
    }
  };
  const resetRow = (index) => {
    const newParticulars = [...particulars];
    newParticulars[index] = {
      itemName: "",
      quantity: 1,
      salePrice: 0.0,
      discountPercent: 0,
      taxPercent: 0,
      gstamount: 0.0,
      amount: 0.0,
    };
    setParticulars(newParticulars);
  };

  const calculateTotals = () => {
    let subTotal = 0;
    let totalGst = 0;
    let totalAmount = 0;

    particulars.forEach((item) => {
      const itemDiscountedPrice =
        item.salePrice * (1 - item.discountPercent / 100);
      const itemGst = itemDiscountedPrice * (item.taxPercent / 100);
      const itemTotal = itemDiscountedPrice + itemGst;

      subTotal += itemDiscountedPrice * item.quantity;
      totalGst += itemGst * item.quantity;
      totalAmount += itemTotal * item.quantity;
    });

    return {
      subTotal,
      totalGst,
      totalAmount,
    };
  };

  const handlePrint = () => {
    const currentDate = new Date().toLocaleDateString(); // Get the current date in a readable format

    const printWindow = window.open("", "", "height=800, width=1000");
    const printContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .invoice-container {
              margin: 0 auto;
              width: 80%;
              border: 1px solid #ccc;
              padding: 20px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .invoice-header img {
              max-width: 150px;
            }
            .invoice-header-details {
              text-align: right;
              flex-grow: 1;
            }
            .address {
              text-align: center;
              margin: 20px 0;
              font-weight: bold;
              font-size: 1.1em;
            }
            .invoice-details {
              margin-bottom: 20px;
            }
            .invoice-details table {
              width: 100%;
              border-collapse: collapse;
            }
            .invoice-details th, .invoice-details td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
            }
            .invoice-footer {
              margin-top: 20px;
              text-align: left;
            }
            .invoice-summary {
              text-align: left;
            }
            .invoice-summary p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header Section -->
            <div class="invoice-header">
              <img src="Logo.png" alt="Company Logo">
              <div class="invoice-header-details">
                <p>Invoice No: ${invoiceData.invoiceNo}</p>
                <p>Date: ${currentDate}</p>
                <p>Client: ${invoiceData.clientName}</p>
                <p>GSTIN: ${invoiceData.clientGSTIN || "--"}</p>
                <p>Payment Status: <strong>${
                  invoiceData.paymentStatus || "Pending"
                }</strong></p>
              </div>
            </div>
  
            <!-- Middle Section for Address -->
            <div class="address">
              Address: ${invoiceData.address}
            </div>
            
            <!-- Details Section -->
            <div class="invoice-details">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Sale Price</th>
                    <th>Discount (%)</th>
                    <th>GST (%)</th>
                    <th>GST Amount</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${particulars
                    .map(
                      (item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.itemName}</td>
                      <td>${item.quantity}</td>
                      <td>${item.salePrice}</td>
                      <td>${item.discountPercent}</td>
                      <td>${item.taxPercent}</td>
                      <td>${item.gstamount}</td>
                      <td>${item.amount.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
  
            <!-- Footer Section -->
            <div class="invoice-footer">
              <div class="invoice-summary">
                <p>Delivery Terms: ${invoiceData.deliveryTerms}</p>
                <p>Sub Total: ₹${calculateTotals().subTotal.toFixed(2)}</p>
                <p>GST Amount: ₹${calculateTotals().totalGst.toFixed(2)}</p>
                <p>Total Amount: ₹${calculateTotals().totalAmount.toFixed(
                  2
                )}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    if (invoiceData.invoiceType === "GST") {
      setInvoiceData((prevState) => ({
        ...prevState,
        invoiceNo: "GST00",
      }));
    } else if (invoiceData.invoiceType === "Without GST") {
      setInvoiceData((prevState) => ({
        ...prevState,
        invoiceNo: "INV00",
      }));
    }
  }, [invoiceData.invoiceType]);

  // Update the paymentStatus when the user selects a different option
  const handlePaymentStatusChange = (e) => {
    setInvoiceData({ ...invoiceData, paymentStatus: e.target.value });
  };

  return (
    <>
      <div className="putHeader">
        <AdminHeader />

        <div>
          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="topForm">
                <div className="top1">
                  <label>Invoice Type</label>
                  <select
                    name="invoiceType"
                    value={invoiceData.invoiceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="GST">GST</option>
                    <option value="Without GST">Without GST</option>
                  </select>
                </div>

                <div className="top2">
                  Invoice No <span className="adminRequired">*</span>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={invoiceData.invoiceNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="top3">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={
                      invoiceData.date || new Date().toISOString().split("T")[0]
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="top4">
                  <label>Place of Supply</label>
                  <input
                    type="text"
                    name="placeOfSupply"
                    value={invoiceData.placeOfSupply}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="top5">
                  <label>Billing Type</label>
                  <div className="billing-type-options">
                    <label htmlFor="cashAccount">
                      <input
                        id="cashAccount"
                        type="radio"
                        name="billingType"
                        value="Cash A/C"
                        checked={invoiceData.billingType === "Cash A/C"}
                        onChange={handleInputChange}
                        required
                      />
                      Cash A/C
                    </label>
                    <label htmlFor="clientAccount">
                      <input
                        id="clientAccount"
                        type="radio"
                        name="billingType"
                        value="Client A/C"
                        checked={invoiceData.billingType === "Client A/C"}
                        onChange={handleInputChange}
                        required
                      />
                      Client A/C
                    </label>
                  </div>
                </div>
              </div>

              <div className="middleForm">
                <div className="middle1">
                  <label htmlFor="">
                    Contact No <span className="adminRequired">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={invoiceData.contactNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="middle2">
                  Client Name <span className="adminRequired">*</span>
                  <input
                    type="text"
                    name="clientName"
                    value={invoiceData.clientName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="middle3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={invoiceData.address}
                    onChange={handleInputChange}
                    rows="3"
                    cols="30"
                  />
                </div>

                

                <div className="middle4">
                  <label>Client GSTIN</label>
                  <input
                    type="text"
                    name="clientGSTIN"
                    value={invoiceData.clientGSTIN}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="middle4">
                  <label>Sold By</label>
                  <input
                    type="text"
                    name="soldBy"
                    value={invoiceData.soldBy}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>

              <div className="table-container">
                <table className="particulars-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Sale Price</th>
                      <th>Discount (%)</th>
                      <th>GST (%)</th>
                      <th>GST Amount</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {particulars.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) =>
                              handleParticularChange(
                                index,
                                "itemName",
                                e.target.value
                              )
                            }
                            placeholder="Item Name"
                            required
                            className="table1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleParticularChange(
                                index,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                            required
                            className="table2"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.salePrice}
                            min="0"
                            onChange={(e) =>
                              handleParticularChange(
                                index,
                                "salePrice",
                                parseFloat(e.target.value)
                              )
                            }
                            required
                            className="table3"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.discountPercent}
                            min="0"
                            max="100"
                            onChange={(e) =>
                              handleParticularChange(
                                index,
                                "discountPercent",
                                parseFloat(e.target.value)
                              )
                            }
                            className="table4"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.taxPercent}
                            min="0"
                            onChange={(e) =>
                              handleParticularChange(
                                index,
                                "taxPercent",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.gstamount || "0.00"}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.amount.toFixed(2)}
                            readOnly
                          />
                        </td>
                        <td>
                          <button type="button" onClick={addParticularRow}>
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeParticularRow(index)}
                            style={{ marginLeft: "5px" }}
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            onClick={() => resetRow(index)}
                            style={{ marginLeft: "5px" }}
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoiceFooter">
                <div className="Add-Deliver-Terms">
                  <label>Add Delivery Terms</label>
                  <textarea
                    name="deliveryTerms"
                    value={invoiceData.deliveryTerms}
                    onChange={handleInputChange}
                    rows="3"
                    cols="30"
                  />
                </div>

                <div className="paymentStatus">
                  <label>Payment Status</label>
                  <select
                    id="paymentStatus"
                    value={invoiceData.paymentStatus}
                    onChange={handlePaymentStatusChange}
                  >
                    <option value="">Select payment status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                   
                  </select>
                </div>

                <div>
                  {(() => {
                    const { subTotal, totalGst, totalAmount } =
                      calculateTotals();
                    return (
                      <>
                        <p>
                          Sub Total: <strong>₹{subTotal.toFixed(2)}</strong>
                        </p>
                        <p>
                          GST Amount: <strong>₹{totalGst.toFixed(2)}</strong>
                        </p>
                        <p>
                          Total Amount:{" "}
                          <strong>₹{totalAmount.toFixed(2)}</strong>
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <button onClick={handlePrint} className="btn">
                Print Invoice
              </button>
              <button
                className="btn"
                style={{
                  position: "fixed",
                  bottom: "10px",
                  right: "20px",
                }}
              >
                Save Invoice
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewInvoice;
