import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../../../admin-header/admin-header";
import { BASE_URL } from "../../../../../../helper/helper";
import "./managePurchase.css";
import { FaPen, FaTimes, FaEye } from "react-icons/fa";

const ManagePurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState(null);

  // Fetch all purchases
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/admin/getall/purchase`,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.purchases) {
        setPurchases(response.data.purchases);
        setFilteredPurchases(response.data.purchases);
        console.log(response.data.purchases);
        // Assuming you're displaying the particulars for the first purchase in the list
        if (response.data.purchases.length > 0) {
          const firstPurchase = response.data.purchases[0];

          if (
            firstPurchase.particulars &&
            Array.isArray(firstPurchase.particulars)
          ) {
            const formattedParticulars = firstPurchase.particulars.map(
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
            setErrorMessage("No particulars found in the first purchase.");
          }
        } else {
          setErrorMessage("No purchases found.");
        }
      } else {
        setErrorMessage("No purchases found.");
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setErrorMessage("Failed to fetch purchases. Please try again.");
    }
  };

  const filterPurchases = (searchValue = "", statusFilter = "all") => {
    const filtered = purchases.filter((purchase) => {
      const matchesSearch =
        purchase.supplierName?.toLowerCase().includes(searchValue) ||
        purchase.itemName?.toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" ||
        purchase.paymentStatus?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredPurchases(filtered);
  };

  const handleEdit = async (purchase) => {
    try {
      // Make the GET request to fetch purchase by ID
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/admin/get/purchase/${purchase._id}`,
        { withCredentials: true }
      );

      // If successful, store the purchase data in state
      if (response.data && response.data.purchase) {
        setPurchaseToEdit(response.data.purchase); // Ensure you're updating purchaseToEdit here
        setModalOpen(true); // Open the modal
      } else {
        console.error("Purchase not found or unauthorized");
      }
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };

  const handleDelete = async (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await axios.delete(
          `${BASE_URL}/api/bilvani/admin/delete/purchase/${purchaseId}`
        );
        setPurchases(
          purchases.filter((purchase) => purchase._id !== purchaseId)
        );
        setFilteredPurchases(
          filteredPurchases.filter((purchase) => purchase._id !== purchaseId)
        );
      } catch (error) {
        setErrorMessage("Failed to delete purchase. Please try again.");
      }
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setPurchaseToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Ensure date is properly formatted before saving
      const updatedEditingPurchase = {
        ...purchaseToEdit,
        date: purchaseToEdit.date?.split("T")[0] || "", // Ensure YYYY-MM-DD format
        particulars: purchaseToEdit.particulars.map((particular) => ({
          ...particular,
          amount: parseFloat(particular.amount).toFixed(2), // Ensuring amount is properly formatted
          gstamount: parseFloat(particular.gstamount).toFixed(2), // Same for gstamount
        })),
      };

      // Make the API request to update the purchase
      const response = await axios.put(
        `${BASE_URL}/api/bilvani/admin/update/purchase/${purchaseToEdit._id}`,
        updatedEditingPurchase,
        { withCredentials: true }
      );

      const updatedPurchase = response.data.purchase;

      // Log the updated purchase and the current purchases state
      console.log("Updated Purchase:", updatedPurchase);
      console.log("Current Purchases:", purchases);

      // Update purchases state immutably
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === purchaseToEdit._id ? updatedPurchase : purchase
        )
      );

      // Update filteredPurchases state immutably
      setFilteredPurchases((prevFilteredPurchases) =>
        prevFilteredPurchases.map((purchase) =>
          purchase._id === purchaseToEdit._id ? updatedPurchase : purchase
        )
      );

      // Close the modal and show success message
      setModalOpen(false);
      alert("Purchase updated successfully!");
    } catch (error) {
      console.error("Failed to update purchase:", error);
      setErrorMessage("Failed to update purchase. Please try again.");
    }
  };

  useEffect(() => {
    fetchPurchases();
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

  const handleParticularChange = (index, field, value) => {
    setPurchaseToEdit((prev) => {
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

        // Calculate discounted price
        const discountedPrice =
          salePrice * quantity * (1 - discountPercent / 100);
        const gstAmount = discountedPrice * (taxPercent / 100);
        const totalAmount = discountedPrice + gstAmount;

        updatedParticulars[index].gstamount = gstAmount.toFixed(2);
        updatedParticulars[index].amount = totalAmount.toFixed(2);
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

    setPurchaseToEdit((prev) => ({
      ...prev,
      particulars: [...prev.particulars, newParticular],
    }));
  };

  const removeParticularRow = (index) => {
    if (purchaseToEdit.particulars.length > 1) {
      const updatedParticulars = purchaseToEdit.particulars.filter(
        (_, i) => i !== index
      );
      setPurchaseToEdit((prevState) => ({
        ...prevState,
        particulars: updatedParticulars,
      }));
    } else {
      // Replace the single row with a default empty row
      setPurchaseToEdit((prevState) => ({
        ...prevState,
        particulars: [
          {
            itemName: "",
            quantity: 1,
            salePrice: 0,
            discountPercent: 0,
            taxPercent: 0,
            gstamount: 0,
            amount: 0,
          },
        ],
      }));
      alert("The table must have at least one row.");
    }
  };

  const handleView = (purchase) => {
    setViewingPurchase(purchase);
    openViewPurchaseWindow(purchase);
  };

  const resetRow = (index) => {
    setPurchaseToEdit((prev) => {
      const updatedParticulars = [...prev.particulars];
      updatedParticulars[index] = {
        itemName: "",
        quantity: 0,
        salePrice: 0,
        discountPercent: 0,
        taxPercent: 0,
        gstamount: 0,
        amount: 0,
      };
      return { ...prev, particulars: updatedParticulars };
    });
  };

  function openViewPurchaseWindow(viewingPurchase) {
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
              <p><strong>Purchase Type:</strong> ${viewingPurchase.purchaseType}</p>
              <p><strong>Purchase No:</strong> ${viewingPurchase.purchaseno}</p>
              <p><strong>Date:</strong> ${new Date(viewingPurchase.date).toLocaleDateString()}</p>
              <p><strong>Place of Supply:</strong> ${viewingPurchase.placeOfSupply}</p>
              <p><strong>Supplier Name:</strong> ${viewingPurchase.supplierName}</p>
              <p><strong>Total Amount:</strong> ${viewingPurchase.totalamount}</p>
              <p><strong>Purchase Order No:</strong> ${viewingPurchase.purchaseOrderNo}</p>
              <p><strong>Contact No:</strong> ${viewingPurchase.contactNo}</p>
              <p><strong>Address:</strong> ${viewingPurchase.address}</p>
              <p><strong>GSTIN:</strong> ${viewingPurchase.supplyGSTIN || 'N/A'}</p>
              <p><strong>Sold By:</strong> ${viewingPurchase.soldBy || 'N/A'}</p>
              <p><strong>Payment Status:</strong> ${viewingPurchase.paymentStatus}</p>
              <p><strong>Supplier Terms:</strong> ${viewingPurchase.SupplierTerms || 'N/A'}</p>
             
            </div>
    
            <h4>Particulars</h4>
            ${viewingPurchase.particulars?.length > 0
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
                  ${viewingPurchase.particulars.map((particular, index) => `
                    <tr>
                      <td>${particular.srno || index + 1}</td>
                      <td>${particular.itemName}</td>
                      <td>${particular.quantity}</td>
                      <td>${particular.salePrice}</td>
                      <td>${particular.discountPercent}</td>
                      <td>${particular.taxPercent}</td>
                      <td>${particular.gstamount}</td>
                      <td>${particular.amount}</td>
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
        <h2 className="manage-title-m">Manage Purchases</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by Supplier Name or Item"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterPurchases(
                e.target.value.toLowerCase(),
                paymentStatusFilter
              );
            }}
            className="search-bar"
          />

          <label htmlFor="">Filter By Payment Status:</label>
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              filterPurchases(searchTerm.toLowerCase(), e.target.value);
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
          {filteredPurchases.length > 0 ? (
            <table className="purchase-table-content-m">
              <thead className="table-header-m">
                <tr className="table-row-m">
                  <th>Supplier Name</th>
                  <th>Purchase Bill No</th>
                  <th>Payment Status</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase._id} className="purchase-row-m">
                    <td>{purchase.supplierName}</td>
                    <td>{purchase.purchaseOrderNo}</td>
                    <td>{purchase.paymentStatus}</td>
                    <td>{purchase.totalamount}</td>
                    <td>
                      <div className="iconofEdit-m">
                        <FaEye
                          className="icon-m view-icon-m"
                          onClick={() => handleView(purchase)}
                        />
                        <FaPen
                          className="icon-m edit-icon-m"
                          onClick={() => handleEdit(purchase)}
                        />
                        <FaTimes
                          className="icon-m delete-icon-m"
                          onClick={() => handleDelete(purchase._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-purchases-m">No purchases available</p>
          )}
        </div>
      </div>

      {modalOpen && purchaseToEdit && (
        <div className="modal-manage-purchase-m">
          <div className="modal-content-purchase-m">
            <h3 className="modal-title-purchase-m">Edit Purchase</h3>
            <form>
              <div className="modelcenter-m">
                <div className="updatePurchaseBox-m">
                  <label>Purchase Type:</label>
                  <select
                    name="purchaseType"
                    value={purchaseToEdit.purchaseType || ""}
                    onChange={handleModalChange}
                    className="select-m"
                  >
                    <option value="GST">GST</option>
                    <option value="Without GST">Non-GST</option>
                  </select>

                  <label>Purchase Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={purchaseToEdit.date?.split("T")[0] || ""}
                    onChange={handleModalChange}
                    className="input-m"
                  />

                  <label>Supplier Name:</label>
                  <input
                    type="text"
                    name="supplierName"
                    value={purchaseToEdit.supplierName || ""}
                    onChange={handleModalChange}
                    placeholder="Supplier Name"
                    className="input-m"
                  />

                  <label>Place of Supply:</label>
                  <input
                    type="text"
                    name="placeOfSupply"
                    value={purchaseToEdit.placeOfSupply || ""}
                    onChange={handleModalChange}
                    placeholder="Place of Supply"
                    className="input-m"
                  />

                  <label>Purchase Bill No:</label>
                  <input
                    type="text"
                    name="purchaseOrderNo"
                    value={purchaseToEdit.purchaseOrderNo || ""}
                    onChange={handleModalChange}
                    placeholder="Purchase Order No"
                    className="input-m"
                  />

                  <label>Total Amount:</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={purchaseToEdit.totalamount || ""}
                    onChange={handleModalChange}
                    placeholder="Total Amount"
                    className="input-m"
                  />

                  <label>Supplier GSTIN:</label>
                  <input
                    type="text"
                    name="supplyGSTIN"
                    value={purchaseToEdit.supplyGSTIN || ""}
                    onChange={handleModalChange}
                    placeholder="Supplier GSTIN"
                    className="input-m"
                  />
    <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={purchaseToEdit.address || ""}
                    onChange={handleModalChange}
                    placeholder="address"
                    className="input-m"
                  />

                  <label>Sold By:</label>
                  <input
                    type="text"
                    name="soldBy"
                    value={purchaseToEdit.soldBy || ""}
                    onChange={handleModalChange}
                    placeholder="sold By"
                    className="input-m"
                  />

                  <label>Supplier Terms:</label>
                  <input
                    type="text"
                    name="SupplierTerms"
                    value={purchaseToEdit.SupplierTerms || ""}
                    onChange={handleModalChange}
                    placeholder="Supplier Terms"
                    className="input-m"
                  />

                  <label>Payment Status:</label>
                  <select
                    name="paymentStatus"
                    value={purchaseToEdit.paymentStatus || ""}
                    onChange={handleModalChange}
                    className="select-m"
                  >
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
                    {purchaseToEdit.particulars &&
                      purchaseToEdit.particulars.map((particular, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={particular.itemName}
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
                              value={particular.quantity}
                              min="1"
                              onChange={(e) =>
                                handleParticularChange(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value, 10)
                                )
                              }
                              required
                              className="table2"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={particular.salePrice}
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
                              value={particular.discountPercent}
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
                              value={particular.taxPercent}
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
                              value={parseFloat(particular.gstamount).toFixed(
                                2
                              )}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={parseFloat(particular.amount).toFixed(2)}
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

export default ManagePurchase;
