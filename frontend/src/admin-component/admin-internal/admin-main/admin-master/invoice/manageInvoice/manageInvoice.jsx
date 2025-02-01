import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../../../admin-header/admin-header";
import { BASE_URL } from "../../../../../../helper/helper";
import { FaPen, FaTimes, FaEye } from "react-icons/fa";
import './manageInvoice.css'

const ManageInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/invoices/all/invoices`, {
        withCredentials: true,
      });

      if (response.data && response.data.invoices) {
        setInvoices(response.data.invoices);
        setFilteredInvoices(response.data.invoices);
        console.log(response.data.invoices);

        // Assuming you're displaying the particulars for the first invoice in the list
        if (response.data.invoices.length > 0) {
          const firstInvoice = response.data.invoices[0];

          if (
            firstInvoice.particulars &&
            Array.isArray(firstInvoice.particulars)
          ) {
            const formattedParticulars = firstInvoice.particulars.map(
              (particular, index) => ({
                srno: `${index + 1}`, // Sequential serial number
                itemName: particular.itemName || "Unknown Item",
                quantity: particular.quantity || 0,
                salePrice: particular.salePrice || 0,
                discountPercent: particular.discountPercent || 0,
                taxPercent: particular.taxPercent || 0,
                gstamount: particular.gstamount
                  ? particular.gstamount.toString()
                  : "0", // Ensure gstamount is a string
                amount: particular.amount || 0, // Default amount
              })
            );
            setParticulars(formattedParticulars);
          } else {
            setErrorMessage("No particulars found in the first invoice.");
          }
        } else {
          setErrorMessage("No invoices found.");
        }
      } else {
        setErrorMessage("No invoices found.");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setErrorMessage("Failed to fetch invoices. Please try again.");
    }
  };



  // Filter invoices by search and status
  const filterInvoices = (searchValue = "", statusFilter = "all") => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.clientName?.toLowerCase().includes(searchValue) ||
        invoice.particulars.some((item) =>
          item.itemName?.toLowerCase().includes(searchValue)
        );
      const matchesStatus =
        statusFilter === "all" ||
        invoice.paymentStatus?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredInvoices(filtered);
  };

  const handleEdit = async (invoice) => {
    try {
      // Make the GET request to fetch invoice by ID
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/admin/get/invoicebyid/${invoice._id}`,
        { withCredentials: true }
      );

      // If successful, store the invoice data in state
      if (response.data && response.data.invoice) {
        setEditingInvoice(response.data.invoice); // Update the state with the fetched invoice
        setModalOpen(true); // Open the modal
      } else {
        console.error("Invoice not found or unauthorized");
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  // Handle delete button click
  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(
          `${BASE_URL}/api/bilvani/admin/delete/invoices/${invoiceId}`
        );
        setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
        setFilteredInvoices(
          filteredInvoices.filter((invoice) => invoice._id !== invoiceId)
        );
      } catch (error) {
        console.error("Failed to delete invoice:", error);
        setErrorMessage("Failed to delete invoice. Please try again.");
      }
    }
  };

  // Handle modal field change
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value, // Dynamically update the property based on the input's name
    }));
  };

  // Save edited invoice
  const handleSave = async () => {
    try {
      // Ensure proper formatting of the invoice object before saving
      const updatedEditingInvoice = {
        ...editingInvoice,
        date: editingInvoice.date?.split("T")[0] || "", // Ensure YYYY-MM-DD format
        particulars: editingInvoice.particulars.map((particular) => ({
          ...particular,
          amount: parseFloat(particular.amount).toFixed(2), // Format amount to two decimal places
          tax: parseFloat(particular.tax).toFixed(2), // Format tax to two decimal places
        })),
      };

      // Make the API request to update the invoice
      const response = await axios.put(
        `${BASE_URL}/api/bilvani/admin/update/invoices/${editingInvoice._id}`,
        updatedEditingInvoice,
        { withCredentials: true }
      );

      const updatedInvoice = response.data.invoice;

      // Log the updated invoice and current invoices state
      console.log("Updated Invoice:", updatedInvoice);
      console.log("Current Invoices:", invoices);

      // Update invoices state immutably
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === updatedInvoice._id ? updatedInvoice : invoice
        )
      );

      // Update filteredInvoices state immutably
      setFilteredInvoices((prevFilteredInvoices) =>
        prevFilteredInvoices.map((invoice) =>
          invoice._id === updatedInvoice._id ? updatedInvoice : invoice
        )
      );

      // Close the modal and show success message
      setModalOpen(false);
      alert(response.data.message || "Invoice updated successfully!");
    } catch (error) {
      console.error("Failed to update invoice:", error);

      const errorMessage =
        error.response?.data?.error ||
        "Failed to update invoice. Please try again.";

      setErrorMessage(errorMessage);
    }
  };

  useEffect(() => {
    const fetchParticulars = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/invoices/all/invoices`, {
          withCredentials: true,
        });

        if (response.data && response.data.invoices) {
          // Flatten the nested particulars array across all invoice
          const formattedData = response.data.invoices.flatMap(
            (invoices, invoicesIndex) =>
              (invoices.particulars || []).map((particular, index) => ({
                srno: `${invoicesIndex + 1}.${index + 1}`, // Composite serial number for clarity
                itemName: particular.itemName || "Unknown Item", // Default itemName
                quantity: particular.quantity || 0, // Default quantity
                salePrice: particular.salePrice || 0, // Default sale price
                discountPercent: particular.discountPercent || 0, // Default discount percent
                taxPercent: particular.taxPercent || 0, // Default tax percent
                gstamount: particular.gstamount
                  ? particular.gstamount.toString()
                  : "0", // Ensure gstamount is a string
                amount: particular.amount || 0, // Default amount
              }))
          );

          console.log(formattedData); // Debugging: Log the flattened data

          // Validate required fields and type constraints
          const isValid = formattedData.every(
            (data) =>
              typeof data.srno === "string" &&
              typeof data.itemName === "string" &&
              data.itemName.trim() !== "" &&
              typeof data.quantity === "number" &&
              typeof data.salePrice === "number" &&
              typeof data.discountPercent === "number" &&
              typeof data.taxPercent === "number" &&
              typeof data.gstamount === "string" &&
              typeof data.amount === "number"
          );

          if (isValid) {
            setParticulars(formattedData); // Set formatted data to state
          } else {
            setErrorMessage("Invalid particulars data format received.");
          }
        } else {
          setErrorMessage("No particulars data found.");
        }
      } catch (error) {
        console.error("Error fetching particulars data:", error);
        setErrorMessage("Failed to fetch particulars. Please try again.");
      }
    };

    fetchParticulars();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  const addParticularRow = () => {
    const newParticular = {
      itemName: "",
      quantity: 0,
      salePrice: 0,
      discountPercent: 0,
      taxPercent: 0,
      gstamount: 0,
      amount: 0,
    };

    setEditingInvoice((prev) => ({
      ...prev,
      particulars: [...prev.particulars, newParticular],
    }));
  };

  const handleParticularChange = (index, field, value) => {
    setEditingInvoice((prev) => {
      const updatedParticulars = [...prev.particulars];
      updatedParticulars[index] = {
        ...updatedParticulars[index],
        [field]: value,
      };

      // Recalculate gstamount and amount if necessary
      if (
        ["quantity", "salePrice", "discountPercent", "taxPercent"].includes(
          field
        )
      ) {
        const salePrice = parseFloat(updatedParticulars[index].salePrice || 0);
        const quantity = parseInt(updatedParticulars[index].quantity || 0, 10);
        const discountPercent = parseFloat(
          updatedParticulars[index].discountPercent || 0
        );
        const taxPercent = parseFloat(
          updatedParticulars[index].taxPercent || 0
        );

        // Calculate discount and taxable amount
        const discount = (salePrice * quantity * discountPercent) / 100;
        const taxableAmount = salePrice * quantity - discount;

        // Calculate GST and total amount
        const gstamount = (taxableAmount * taxPercent) / 100;
        const totalamount = taxableAmount + gstamount;

        updatedParticulars[index].gstamount = gstamount.toFixed(2);
        updatedParticulars[index].amount = totalamount.toFixed(2);
      }

      // Calculate total amounts across all particulars
      const subTotal = updatedParticulars.reduce(
        (sum, item) =>
          sum +
          parseFloat(item.salePrice || 0) * parseInt(item.quantity || 0, 10),
        0
      );

      const totalGst = updatedParticulars.reduce(
        (sum, item) => sum + parseFloat(item.gstamount || 0),
        0
      );

      const totalamount = updatedParticulars.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );

      // Update the state with recalculated totals
      return {
        ...prev,
        particulars: updatedParticulars,
        subTotal: subTotal.toFixed(2),
        totalGst: totalGst.toFixed(2),
        totalamount: totalamount.toFixed(2),
      };
    });
  };

  const removeParticularRow = (index) => {
    setEditingInvoice((prevState) => {
      const updatedParticulars =
        prevState.particulars.length > 1
          ? prevState.particulars.filter((_, i) => i !== index)
          : [
              {
                itemName: "",
                quantity: 1,
                salePrice: 0,
                discountPercent: 0,
                taxPercent: 0,
                gstamount: 0,
                amount: 0,
              },
            ];

      if (prevState.particulars.length === 1) {
        alert("The table must have at least one row.");
      }

      return {
        ...prevState,
        particulars: updatedParticulars,
      };
    });
  };

  const handleView = (invoice) => {
    if (!invoice) {
        alert("Invalid invoice data.");
        return;
    }

    console.log("Viewing invoice:", invoice); // Debugging line
    setViewingInvoice(invoice);
    openViewInvoiceWindow(invoice);
};

function openViewInvoiceWindow(viewingInvoice) {
  const newWindow = window.open("", "_blank", "width=800,height=600");

  if (newWindow) {
    // Dynamically generate HTML content for the new window
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>View Purchase</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
          }
          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }
          .details p {
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #ccc;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          .button-container {
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 15px;
            margin-right: 10px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
  
          <div class="details">
            <p><strong>Invoice Type:</strong> ${viewingInvoice.invoiceType}</p>
            <p><strong>Invoice No:</strong> ${viewingInvoice.invoiceNo}</p>
            <p><strong>Date:</strong> ${new Date(viewingInvoice.date).toLocaleDateString()}</p>
            <p><strong>Place of Supply:</strong> ${viewingInvoice.placeOfSupply}</p>
            <p><strong>Client Name:</strong> ${viewingInvoice.clientName}</p>
            <p><strong>Total Amount:</strong> ${viewingInvoice.totalamount}</p>
          
            <p><strong>Contact No:</strong> ${viewingInvoice.contactNo}</p>
            <p><strong>Address:</strong> ${viewingInvoice.address}</p>
            <p><strong>GSTIN:</strong> ${viewingInvoice.clientGSTIN || 'N/A'}</p>
            <p><strong>Sold By:</strong> ${viewingInvoice.soldBy || 'N/A'}</p>
            <p><strong>Payment Status:</strong> ${viewingInvoice.paymentStatus}</p>
            <p><strong>Delivery Terms:</strong> ${viewingInvoice.deliveryTerms || 'N/A'}</p>
           
          </div>
  
          <h4>Particulars</h4>
          ${viewingInvoice.particulars?.length > 0
            ? `
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Sale Price</th>
                  <th>Discount (%)</th>
                  <th>Tax (%)</th>
                  <th>GST Amount</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${viewingInvoice.particulars.map((particulars, index) => `
                  <tr>
                    <td>${particulars.srno|| index + 1}</td>
                    <td>${particulars.itemName}</td>
                    <td>${particulars.quantity}</td>
                    <td>${particulars.salePrice}</td>
                    <td>${particulars.discountPercent}</td>
                    <td>${particulars.taxPercent}</td>
                    <td>${particulars.gstamount}</td>
                    <td>${particulars.amount}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            `
            : `<p>No particulars available.</p>`
          }
  
          <div class="button-container">
            <a href="#" onclick="window.print()" class="button">Print</a>
            <a href="#" onclick="window.close()" class="button">Close</a>
          </div>
        </div>
      </body>
      </html>
    `);

    // Close the document to ensure it is fully loaded
    newWindow.document.close();
  } else {
    alert("Please allow popups for this website.");
  }
}


  return (
    <div className="manage-purchase-m putHeader">
      <AdminHeader />
      <div className="container">
        <h2 className="manage-title-m">Manage Invoices</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by Client Name or Item"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Update the search term state
              filterInvoices(e.target.value, paymentStatusFilter);
            }}
            className="search-bar"
          />

          <label htmlFor="paymentStatusFilter">Filter By Payment Status:</label>
          <select
            id="paymentStatusFilter"
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value); // Update the payment status state
              filterInvoices(searchTerm, e.target.value);
            }}
            className="status-filter-m"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {errorMessage && <p className="error-m">{errorMessage}</p>}
        <div className="purchase-table-m">
          {filteredInvoices.length > 0 ? (
            <table className="purchase-table-content-m">
              <thead className="table-header-m">
                <tr className="table-row-m">
                  <th>Client Name </th>
                  <th>Invoice Number</th>
                  <th>Payment Status</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="purchase-row-m">
                    <td>{invoice.clientName}</td>
                    <td>{invoice.invoiceNo}</td>
                    <td>{invoice.paymentStatus}</td>
                    <td>{invoice.totalamount}</td>
                    <td>
                      <td>
                        <td>
                          <div className="iconofEdit-m">
                            <FaEye
                              className="icon-m view-icon-m"
                              onClick={() => handleView(invoices)}
                            />
                            <FaPen
                              className="icon-m edit-icon-m"
                              onClick={() => handleEdit(invoice)}
                            />
                            <FaTimes
                              className="icon-m delete-icon-m"
                              onClick={() => handleDelete(invoice._id)}
                            />
                          </div>
                        </td>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-invoice-m">No invoice available</p>
          )}
        </div>
      </div>

      {modalOpen && editingInvoice && (
        <div className="modal-manage-purchase-m">
          <div className="modal-content-purchase-m">
            <h3 className="modal-title-purchase-m">Edit Invoice</h3>
            <form>
              <div className="modelcenter-m">
                <div className="updatePurchaseBox-m">
                  <label>Invoice Type:</label>
                  <select
                    name="invoiceType"
                    value={editingInvoice.invoiceType || ""}
                    onChange={handleModalChange}
                    className="select-m"
                  >
                    <option value="GST">GST</option>
                    <option value="Without GST">Non-GST</option>
                  </select>

                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={editingInvoice.date?.split("T")[0] || ""}
                    onChange={handleModalChange}
                    className="input-m"
                  />

                  <label>Client Name:</label>
                  <input
                    type="text"
                    name="clientName"
                    value={editingInvoice.clientName || ""}
                    onChange={handleModalChange}
                    placeholder="Client Name"
                    className="input-m"
                  />

                  <label>Place of Supply:</label>
                  <input
                    type="text"
                    name="placeOfSupply"
                    value={editingInvoice.placeOfSupply || ""}
                    onChange={handleModalChange}
                    placeholder="Place of Supply"
                    className="input-m"
                  />

                  <label>Invoice Number:</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={editingInvoice.invoiceNo || ""}
                    onChange={handleModalChange}
                    placeholder="Invoice No"
                    className="input-m"
                  />

                  <label>Total Amount:</label>
                  <input
                    type="number"
                    name="totalamount"
                    value={editingInvoice.totalamount || ""}
                    onChange={handleModalChange}
                    placeholder="Total Amount"
                    className="input-m"
                  />

                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editingInvoice.address || ""}
                    onChange={handleModalChange}
                    placeholder="address"
                    className="input-m"
                  />

                
                    <label>clientGSTIN:</label>
                  <input
                    type="text"
                    name="clientGSTIN"
                    value={editingInvoice.clientGSTIN || ""}
                    onChange={handleModalChange}
                    placeholder="Supplier GSTIN"
                    className="input-m"
                  />
                  <label> soldBy:</label>
                  <input
                    type="text"
                    name="soldBy"
                    value={editingInvoice.soldBy || ""}
                    onChange={handleModalChange}
                    placeholder="soldBy"
                    className="input-m"
                  />

<label> deliveryTerms:</label>
                  <input
                    type="text"
                    name="deliveryTerms"
                    value={editingInvoice.deliveryTerms || ""}
                    onChange={handleModalChange}
                    placeholder="deliveryTerms"
                    className="input-m"
                  />

<label>Payment Status:</label>
                  <select
                    name="billingType"
                    value={editingInvoice.billingType || ""}
                    onChange={handleModalChange}
                    className="select-m"
                  >
                    
                    <option value="Cash A/C">Cash A/C</option>
                    <option value="Client A/C">Client A/C</option>
                  </select>


                  <label>Payment Status:</label>
                  <select
                    name="paymentStatus"
                    value={editingInvoice.paymentStatus || ""}
                    onChange={handleModalChange}
                    className="select-m"
                  >
                    <option value="all">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Particulars Table Section */}
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
                    {editingInvoice.particulars &&
                      editingInvoice.particulars.map((particulars, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={particulars.itemName}
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
                              value={particulars.quantity}
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
                              value={particulars.salePrice}
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
                              value={particulars.discountPercent}
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
                              value={particulars.taxPercent}
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
                              value={parseFloat(
                                particulars.gstamount || "0"
                              ).toFixed(2)}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={parseFloat(
                                particulars.amount || "0"
                              ).toFixed(2)}
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

              <div className="modal-buttons-purchase-m">
                <button
                  type="button"
                  onClick={handleSave}
                  className="save-btn-purchase-m"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cancel-btn-purchase-m"
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

export default ManageInvoice;
