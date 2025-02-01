import React, { useState, useEffect } from "react";
import AdminHeader from "../../../admin-header/admin-header";
import axios from "axios";
import { BASE_URL } from "../../../../../helper/helper";
import "./addpurchase.css";

const AddPurchase = () => {
  const [purchaseData, setPurchaseData] = useState({
    purchaseType: "", // "GST" or "Without GST"
    purchaseno: "",
    date: "",
    placeOfSupply: "",
    purchaseOrderNo: "",
    contactNo: "",
    supplierName: "",
    address: "",
    supplyGSTIN: "", // Updated field name
    soldBy: "", // Optional field
    paymentStatus: "", // Default value
    SupplierTerms: "", // Optional field
  });
  useEffect(() => {
    if (purchaseData.billingType === "Cash A/C") {
      setPurchaseData((prevData) => ({
        ...prevData,
        supplierName: "Cash", // Set default supplier name when "Cash A/C" is selected
      }));
    } else if (purchaseData.billingType === "Supplier A/C") {
      setPurchaseData((prevData) => ({
        ...prevData,
        supplierName: "", // Clear supplier name when "supplier A/C" is selected
      }));
    }
  }, [purchaseData.billingType]);

  useEffect(() => {
    if (purchaseData.purchaseType === "GST") {
      setPurchaseData((prevState) => ({
        ...prevState,
        purchaseno: "GST00",
      }));
    } else if (purchaseData.purchaseType === "Without GST") {
      setPurchaseData((prevState) => ({
        ...prevState,
        purchaseno: "INV00",
      }));
    }
  }, [purchaseData.purchaseType]);

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate totals and prepare the final data
    const { totalAmount } = calculateTotals();

    // Prepare final purchase data
    const finalPurchaseData = {
      ...purchaseData,
      particulars: particulars.map((item) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        salePrice: item.salePrice,
        discountPercent: item.discountPercent || 0,
        taxPercent: item.taxPercent || 0,
        gstamount: item.gstamount || 0,
        amount: item.amount || 0,
      })),
      totalAmount: totalAmount.toFixed(2),
      date: purchaseData.date || new Date().toISOString().split("T")[0], // Default to current date if not provided
    };

    try {
      // Send data to the backend
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/admin/create/purchase`,
        finalPurchaseData,
        {
          withCredentials: true, // Ensure credentials are included if needed
        }
      );

      if (response.status === 200) {
        console.log("Purchase created successfully");
        navigate("/admin-dashboard"); // Navigate on success
      }
    } catch (error) {
      console.error("Error creating purchase:", error.message);
    }
  };

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

    // Update total amount in purchaseData
    const { totalAmount } = calculateTotals();
    setPurchaseData((prevData) => ({
      ...prevData,
      totalamount: totalAmount.toFixed(2), // Set the total amount in purchase data
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

  const handlePaymentStatusChange = (e) => {
    setPurchaseData({
      ...purchaseData,
      paymentStatus: e.target.value,
    });
  };

  const handlePrint = () => {
    const currentDate = new Date().toLocaleDateString(); // Get the current date in a readable format

    const printWindow = window.open("", "", "height=800, width=1000");
    const printContent = `
        <html>
          <head>
            <title>Purchase</title>
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
                  <p>Purchase Order No: ${purchaseData.purchaseOrderNo}</p>
                  <p>Date: ${currentDate}</p>
                  <p>Supplier: ${purchaseData.supplierName}</p>
                  <p>Payment Status: <strong>${
                    purchaseData.paymentStatus || ""
                  }</strong></p>
                  <p>Purchase No: ${purchaseData.purchaseno}</p>
                  <p>Supplier GSTIN: ${purchaseData.supplierGSTIN}</p>
                </div>
              </div>
    
              <!-- Middle Section for Address -->
              <div class="address">
                Address: ${purchaseData.address}
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
                          <td>${item.discountPercent || 0}</td>
                          <td>${item.taxPercent || 0}</td>
                          <td>${(
                            (item.salePrice *
                              item.quantity *
                              (item.taxPercent || 0)) /
                            100
                          ).toFixed(2)}</td>
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
                  <p>Supplier Terms: ${purchaseData.supplierTerms}</p>
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

  return (
    <>
      <div className="putHeader">
        <AdminHeader />

        <div>
          <div className="">
            <form onSubmit={handleSubmit}>
              <div className="topForm">
                <div className="top1">
                  <label>Purchase Type</label>
                  <select
                    name="purchaseType" // Changed from invoiceType to purchaseType
                    value={purchaseData.purchaseType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="GST">GST</option>
                    <option value="Without GST">Without GST</option>
                  </select>
                </div>

                <div className="top2">
                  purchase No <span className="adminRequired">*</span>
                  <input
                    type="text"
                    name="purchaseno" // Correct name should be "purchaseno"
                    value={purchaseData.purchaseno}
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
                      purchaseData.date ||
                      new Date().toISOString().split("T")[0]
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
                    value={purchaseData.placeOfSupply}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="purchase1">
                  <label htmlFor="purchaseOrderNo">Purchase Order No</label>
                  <input
                    id="purchaseOrderNo"
                    type="text"
                    name="purchaseOrderNo"
                    value={purchaseData.purchaseOrderNo || ""}
                    onChange={handleInputChange}
                    required
                  />
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
                    value={purchaseData.contactNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="middle2">
                  Supplier Name <span className="adminRequired">*</span>
                  <input
                    type="text"
                    name="supplierName"
                    value={purchaseData.supplierName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="middle3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={purchaseData.address}
                    onChange={handleInputChange}
                    rows="3"
                    cols="30"
                  />
                </div>

                <div className="middle4">
                  <label>Supplier GSTIN</label>
                  <input
                    type="text"
                    name="supplyGSTIN"
                    value={purchaseData.supplyGSTIN}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="middle4">
                  <label>sold by</label>
                  <input
                    type="text"
                    name="soldBy"
                    value={purchaseData.soldBy}
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
                  <label>Add Supplier Terms</label>
                  <textarea
                    name="supplierrTerms"
                    value={purchaseData.supplierrTerms}
                    onChange={handleInputChange}
                    rows="3"
                    cols="30"
                  />
                </div>

                <div className="paymentStatus">
                  <label>Payment Status</label>
                  <select
                    id="paymentStatus"
                    value={purchaseData.paymentStatus}
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
                Print Purchase
              </button>
              <button
                className="btn"
                style={{
                  position: "fixed",
                  bottom: "10px",
                  right: "20px",
                }}
              >
                Save Purchase
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPurchase;
