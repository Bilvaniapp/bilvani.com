import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "../../admin-header/admin-header";
import "./adminDashboard.css";
import axios from "axios";
import { BarChart, Bar, XAxis, LabelList,YAxis } from "recharts";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

import { BASE_URL } from "../../../../helper/helper";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleSection, setVisibleSection] = useState("Recent");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [grossSale, setGrossSale] = useState(0);
  const [pendingTotalAmount, setPendingTotalAmount] = useState(0);

  const [pendingInvoices, setPendingInvoices] = useState([]);

  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/bilvani/invoice`, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        const invoices = response.data.invoices;
  
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        let totalPendingAmount = 0;
  
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const allDaysOfMonth = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, currentMonth, day);
          allDaysOfMonth.push(date);
        }
  
        const groupedByDate = {};
        let todayTotalAmount = 0;
        const pendingInvoices = []; // To store client due information
  
        invoices.forEach((invoice) => {
          const invoiceDate = new Date(invoice.date);
  
          if (invoice.paymentStatus === "Pending") {
            totalPendingAmount += parseFloat(invoice.totalamount);
            pendingInvoices.push({
              clientName: invoice.clientName,
              contactNo: invoice.contactNo,
              totalAmount: invoice.totalamount,
            }); // Add pending invoices
          }
  
          // Check if the invoice is for the current date
          if (
            invoiceDate.getFullYear() === currentYear &&
            invoiceDate.getMonth() === currentMonth &&
            invoiceDate.getDate() === currentDate.getDate()
          ) {
            todayTotalAmount += parseFloat(invoice.totalamount);
          }
  
          // Check if the invoice is for the current month
          if (
            invoiceDate.getFullYear() === currentYear &&
            invoiceDate.getMonth() === currentMonth
          ) {
            const formattedDate = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }).format(invoiceDate);
  
            if (!groupedByDate[formattedDate]) {
              groupedByDate[formattedDate] = 0;
            }
  
            groupedByDate[formattedDate] += parseFloat(invoice.totalamount);
          }
        });
  
        // Calculate the 5 previous and 5 future days, including the current date
        const daysRange = [];
        for (let i = -5; i <= 5; i++) {
          const targetDate = new Date(currentDate);
          targetDate.setDate(currentDate.getDate() + i);
          daysRange.push(targetDate);
        }
  
        const finalData = daysRange.map((date) => {
          const formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          }).format(date);
  
          return {
            date: formattedDate,
            totalAmount: groupedByDate[formattedDate] || 0,
          };
        });
  
        // Sort the final data based on date
        finalData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
  
        setChartData(finalData);
        setPendingInvoices(pendingInvoices); // Set pending invoices in state
        setGrossSale(todayTotalAmount);
        setPendingTotalAmount(totalPendingAmount);
      } else {
        setError(response.data.message || "Failed to fetch invoices");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  

  const formatLabel = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  const [payments, setPayments] = useState([]);
  const [amountReceived, setAmountReceived] = useState(0);
  const [todayAmountReceived, setTodayAmountReceived] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]); // New state for store orders
  const [storeError, setStoreError] = useState(""); // New state for store error

  const fetchPaymentsIn = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/admin/getall/paymentIn`,
        {
          withCredentials: true,
        }
      );
      const paymentData = response.data.payments;

      // Calculate total received amount
      const totalReceived = paymentData
        .filter((payment) => payment.paymentStatus === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0);

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Calculate today's amount received
      const totalReceivedToday = paymentData
        .filter((payment) => {
          const paymentDate = new Date(payment.date)
            .toISOString()
            .split("T")[0];
          return (
            payment.paymentStatus === "paid" && paymentDate === currentDate
          );
        })
        .reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate payments for the current month
      const currentMonth = new Date().getMonth(); // Current month (0-based index)
      const currentYear = new Date().getFullYear();
      const monthlyPayments = paymentData.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          payment.paymentStatus === "paid" &&
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });

      setPayments(paymentData);
      setAmountReceived(totalReceived);
      setTodayAmountReceived(totalReceivedToday);
      setMonthlyPayments(monthlyPayments); // Save monthly payments to state
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Do nothing for 401 errors, so they don't show in the console
        return;
      }
    }
  };
  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/fetch/pending/product`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setStoreOrders(response.data.data);
      } else {
        setStoreError(response.data.message || "Failed to fetch store data.");
      }
    } catch (err) {
      setStoreError(
        err.response?.data?.message ||
          "An error occurred while fetching store data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchPaymentsIn();
    fetchStoreData();
  }, [location]);

  const handleAccept = async (productId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/bilvani/update/pending/product/${productId}`,
        {}, // Empty body for PUT request if you're only updating the product status
        {
          withCredentials: true, // Ensure cookies and session info are included
        }
      );

      if (response.data.success) {
        alert("Product confirmed successfully!");
        fetchStoreData();
      } else {
        alert("Failed to confirm product: " + response.data.message);
      }
    } catch (error) {
      console.error("Error confirming product:", error);
      alert("Error confirming product");
    }
  };

  const handleReject = async (productId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/bilvani/update/reject/product/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Product Reject successfully!");
        fetchStoreData();
      } else {
        alert("Failed to confirm product: " + response.data.message);
      }
    } catch (error) {
      console.error("Error confirming product:", error);
      alert("Error confirming product");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleView = async (productId) => {
    try {
      setIsLoading(true); // Start loading
      setIsModalOpen(true); // Open modal immediately

      const response = await axios.get(
        `${BASE_URL}/api/bilvani/fetch/single/pending/product`,
        {
          params: { productId },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setModalData(response.data.data);
      } else {
        alert(response.data.message);
        setIsModalOpen(false); // Close modal if data fetch fails
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Failed to fetch product details.");
      setIsModalOpen(false); // Close modal on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const [colorCode, setColorCode] = useState(""); // State to hold user input
  const [colors, setColors] = useState([]); // State to store fetched colors
  const [modalDataColor, setModalDataColor] = useState(null); // Data for modal
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state

  const [productName, setProductName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirm, setConfirm] = useState("accepted");

  const fetchColors = async () => {
    setError(""); // Reset error state
    setLoading(true); // Set loading state
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/fetch/code/color?colorCode=${colorCode}`
      );
      const fetchedData = response.data; // API returns an array
      if (fetchedData.length > 0) {
        setModalDataColor(fetchedData[0]); // Use the first object in the array
        setModalOpen(true); // Open modal
      } else {
        setError("No data found for the provided color code.");
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response && err.response.data
          ? err.response.data
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalDataColor(null);
    window.location.reload()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("Token is required in cookies");
        return;
      }

      // Prepare the payload with form inputs and modal data
      const payload = {
        shade: modalDataColor.colors.map((color) => ({
          hex: color.hex,
          shade: color.shade,
          intensity: color.intensity,
        })),
        mixColor: modalDataColor.mixedColorHex,
        colorCode: modalDataColor.colorCode,
        productName,
        userName,
        phoneNumber,
        confirm,
      };

      // Send the data to the API
      await axios.post(`${BASE_URL}/api/bilvani/store/order`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      alert("Color successfully created");
      window.location.reload()
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message || "An error occurred while submitting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="putHeader">
        <AdminHeader />
        <div className="  container">
          <div className="dashboardContainer">
            <div className="leftsideContainer">
              <div className="box1">
                <div className="internalDiv1">
                  <p>QUICK INFO</p>
                  <p className="internalDiv_Today">TODAY</p>
                </div>
                <div className="internalDiv2">
                  <div className="sameFor3">
                    <p>GROSS SALE</p>
                    <p>₹ {formatLabel(grossSale) || 0}</p>
                  </div>
                  <div className="sameFor3">
                    <p>AMOUNT RECIVED</p>
                    <p>₹ {formatLabel(todayAmountReceived) || 0}</p>
                  </div>

                  <div className="sameFor3">
                    <p>AMOUNT DUE </p>
                    <p>₹ {formatLabel(pendingTotalAmount) || 0}</p>
                  </div>
                </div>
              </div>
              <div className="box2">
                <div className="box2internal1">
                  <div className="nestedinternal1" onClick={() => navigate("/admin/bilvani/new/invoice")}>
                    <img
                      src="Admin/invoiceIcon.svg"
                      alt="loading-Invoice"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>New Invoice</p>
                  </div>

                  <div
                    className="nestedinternal2"
                    onClick={() => navigate("/admin-bilvani-purchase")}
                  >
                    <img
                      src="Admin/purchasedIcon.svg"
                      alt="loading-Invoice"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>Add Purchase</p>
                  </div>
                </div>

                <div className="box2internal2">
                  <div
                    className="nestedinternal3"
                    onClick={() => navigate("/admin-bilvani-expense")}
                  >
                    <img
                      src="Admin/expenseIcon.svg"
                      alt="loading-Expense"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>Add Expense</p>
                  </div>

                  <div
                    className="nestedinternal4"
                    onClick={() => navigate("/admin-bilvani-customer")}
                  >
                    <img
                      src="Admin/customerIcon.svg"
                      alt="loading-Customer"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>Add Customer</p>
                  </div>
                </div>

                <div className="box2internal3">
                  <div
                    className="nestedinternal3"
                    onClick={() => navigate("/admin-bilvani-paymentIn")}
                  >
                    <img
                      src="Admin/expenseIcon.svg"
                      alt="loading-Expense"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>Payment In</p>
                  </div>

                  <div
                    className="nestedinternal4"
                    onClick={() => navigate("/admin-bilvani-paymentOut")}
                  >
                    <img
                      src="Admin/customerIcon.svg"
                      alt="loading-Customer"
                      className="img-fluid"
                      width="26px"
                    />
                    <p>Payment Out</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rightsideContainer">
              <div>
                <div className="rightBox1">
                  <p
                    onClick={() => setVisibleSection("Recent")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        visibleSection === "Recent" ? "bold" : "normal",
                      color: visibleSection === "Recent" ? "#007bff" : "#000",
                    }}
                  >
                    Recent
                  </p>
                  <p
                    onClick={() => setVisibleSection("Client Due")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        visibleSection === "Client Due" ? "bold" : "normal",
                      color:
                        visibleSection === "Client Due" ? "#007bff" : "#000",
                    }}
                  >
                    Client Due
                  </p>
                  <p
                    onClick={() => setVisibleSection("Amount Received")}
                    style={{
                      cursor: "pointer",
                      fontWeight:
                        visibleSection === "Amount Received"
                          ? "bold"
                          : "normal",
                      color:
                        visibleSection === "Amount Received"
                          ? "#007bff"
                          : "#000",
                    }}
                  >
                    Amount Received
                  </p>
                </div>

                <div >
                  <div>
                    {visibleSection === "Recent" && (
                    <BarChart
                      width={950}
                      height={250}
                      data={chartData}
                      margin={{ top: 20, right: 3, left: 2, bottom: 1 }}
                    >
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
             
                      <Bar dataKey="totalAmount" fill="#82ca9d" barSize={15}  >
                        <LabelList
                          dataKey="totalAmount"
                          position="top"
                          formatter={formatLabel}
                          style={{ fontSize: 12, fill: "#000000" }}
                        />
                      </Bar>
                    </BarChart>
                  )}
                  </div>

                  {visibleSection === "Client Due" && (
                    <div>
                      {pendingInvoices.length > 0 ? (
                        <div className="duesTableContainer">
                          <table className="styled-table">
                            <thead>
                              <tr>
                                <th>Client Name</th>
                                <th>Contact No</th>
                                <th>Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingInvoices.map((invoice, index) => (
                                <tr key={index}>
                                  <td>{invoice.clientName}</td>
                                  <td>{invoice.contactNo}</td>
                                  <td>₹ {formatLabel(invoice.totalAmount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="no-data-message">No pending invoices</p>
                      )}
                    </div>
                  )}

                  {visibleSection === "Amount Received" && (
                    <div>
                      <div className="duesTableContainer">
                        {monthlyPayments.length > 0 ? (
                          <table className="styled-table">
                            <thead>
                              <tr>
                                <th>Client Name</th>
                                <th>Invoice No</th>
                                <th>Date</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyPayments.map((payment, index) => (
                                <tr key={index}>
                                  <td>{payment.customerName}</td>
                                  <td>{payment.invoiceNo}</td>
                                  <td>
                                    {new Date(
                                      payment.date
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>₹ {formatLabel(payment.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="no-data-message">
                            No payments received this month
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bottomContainerAdmin">
            <div className="">
              <h5>Customized Order</h5>
              {storeOrders.length > 0 ? (
                <div className="containerTableAdmin tableWrapper">
                  <table className="styled-table">
                    <thead>
                      <tr>
                        <th>Phone</th>
                        <th>Payment</th>
                        <th>Confirm</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="tableOrderDescion">
                      {storeOrders.map((store, index) => (
                        <tr key={index}>
                          <td>{store.phoneNumber}</td>
                          <td>{store.payment?.method || "N/A"}</td>
                          <td>{store.confirm}</td>
                          <td style={{ display: "flex", gap: "20px" }}>
                            <div onClick={() => handleAccept(store._id)}>
                              <FaCheck />
                            </div>
                            <div onClick={() => handleReject(store._id)}>
                              <FaTimes />
                            </div>
                            <div onClick={() => handleView(store._id)}>
                              <FaEye />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isModalOpen && modalData && (
                    <div className="modal_CustomModal">
                      <div className="modal_content_adminCustom">
                        <h4>More Details</h4>
                        <p>
                          <strong>Name:</strong> {modalData.name}
                        </p>
                        <p>
                          <strong>Base:</strong> {modalData.base}
                        </p>
                        <p>
                          <strong>Type:</strong> {modalData.type}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {modalData.quantity}
                        </p>
                        <p>
                          <strong>Total Price:</strong> {modalData.totalPrice}
                        </p>
                        <p>
                          <strong>Phone:</strong> {modalData.phoneNumber}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {modalData.payment?.method || "N/A"}
                        </p>
                        <p>
                          <strong>User Address:</strong> {modalData.userAddress}
                        </p>
                        <button
                          onClick={closeModal}
                          className="buttonAdminCustomOrder"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>No store orders available</p>
              )}
            </div>

            <div>
              <h5>Store Order</h5>
              <div className="colorCodeInput">
                <input
                  type="text"
                  placeholder="Enter color code"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                />
                <button
                  onClick={fetchColors}
                  disabled={!colorCode.trim() || loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>

              {loading && <p>Loading...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* Modal */}
              {modalOpen && modalDataColor && (
                <div className="modal_CustomModal_storeorder">
                  <div className="modal_content_adminCustomStoreOrder">
                    <h4>Color Details</h4>
                    <p>
                      <strong>Color Code:</strong>{" "}
                      {modalDataColor.colorCode || "N/A"}
                    </p>
                    <p>
                      <strong>Mixed Color Hex:</strong>{" "}
                      {modalDataColor.mixedColorHex || "N/A"}
                    </p>

                    <div>
                      <strong>Colors:</strong>
                      {modalDataColor.colors &&
                      modalDataColor.colors.length > 0 ? (
                        <table className="styled-table">
                          <thead>
                            <tr>
                              <th>Hex</th>
                              <th>Shade</th>
                              <th>Intensity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalDataColor.colors.map((color, index) => (
                              <tr key={index}>
                                <td>{color.hex}</td>
                                <td>{color.shade}</td>
                                <td>{color.intensity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No colors available</p>
                      )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label>Product Name:</label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>User Name:</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Phone Number:</label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Confirm:</label>
                        <select
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                        >
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      <button type="submit">Submit</button>
                    </form>

                    <button
                      onClick={closeModal}
                      className="buttonAdminCustomOrder"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
