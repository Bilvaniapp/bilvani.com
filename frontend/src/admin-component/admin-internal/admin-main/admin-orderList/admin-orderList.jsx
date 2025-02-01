import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../helper/helper";
import AdminHeader from "../../admin-header/admin-header";
import * as XLSX from "xlsx";
import "./admin-orderList.css"; 

const AdminOrdersList = () => {
  const [getAdminOrders, setGetAdminOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderType, setOrderType] = useState("admin"); // Default selection is 'admin'
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const ordersPerPage = 10; // Number of orders to display per page

  // Function to fetch data from both APIs
  const fetchOrders = async () => {
    try {
      // Fetch data from the '/api/bilvani/get/admin' API
      const getAdminResponse = await axios.get(`${BASE_URL}/api/bilvani/get/admin`);
      setGetAdminOrders(getAdminResponse.data.data);

      // Fetch data from the '/api/bilvani/admin/order' API
      const confirmedOrderResponse = await axios.get(`${BASE_URL}/api/bilvani/admin/order`);
      setConfirmedOrders(confirmedOrderResponse.data.data);

      // By default, display all admin orders
      setDisplayedOrders(getAdminResponse.data.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  // Handle select option change
  const handleOrderTypeChange = (event) => {
    const selectedType = event.target.value;
    setOrderType(selectedType);
    setCurrentPage(1); // Reset to page 1 when changing order type

    // Display orders based on the selected option
    if (selectedType === "admin") {
      setDisplayedOrders(getAdminOrders);
    } else if (selectedType === "confirmed") {
      setDisplayedOrders(confirmedOrders);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = displayedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle "Next" and "Previous" buttons
  const handleNextPage = () => {
    if (currentPage < Math.ceil(displayedOrders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Export data to Excel
const exportToExcel = () => {
    const exportData = displayedOrders.map((order) => {
      return {
        "Order ID": order.orderId,
        "Customer Name": order.customerFirstName,
        Products: order.products
          .map((product) => `${product.name} (Color: ${product.color})`)
          .join(", "),
        Quantity: order.quantity,
        "Phone Number": order.phoneNumber,
        Address: `${order.district}, ${order.state}, ${order.pincode}`,
        "Payment ID": order.razorpay_payment_id,
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  
    // Set dynamic file name based on selected order type
    const fileName = orderType === "admin" ? "custom_color_orders.xlsx" : "product_orders.xlsx";
    
    XLSX.writeFile(workbook, fileName);
  };
  

  if (loading) {
    return <div className="orders-loading">Loading...</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  const totalPages = Math.ceil(displayedOrders.length / ordersPerPage);

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="orders-containers container">
        <h2 className="orders-title">Orders List</h2>

  
        <div className="orders-filter">
          <label htmlFor="orderType">Select Order Type: </label>
          <select id="orderType" value={orderType} onChange={handleOrderTypeChange}>
            <option value="admin">Custom Color Orders</option>
            <option value="confirmed">Product Orders</option>
          </select>
        </div>

      
        <div className="export-excel-button">
        <button onClick={exportToExcel} className="btn btn-outline-success">
          Export to Excel
        </button>
        </div>

        {currentOrders.length > 0 ? (
          <>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerFirstName}</td>
                    <td>
                      {order.products.map((product, index) => (
                        <span key={index}>
                          {product.name} (Color: {product.color})<br />
                        </span>
                      ))}
                    </td>
                    <td>{order.quantity}</td>
                    <td>{order.phoneNumber}</td>
                    <td>
                      {order.district}, {order.state}, {order.pincode}
                    </td>
                    <td>{order.razorpay_payment_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>

       
            {totalPages > 1 && ( 
              <div className="pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-button ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="orders-empty">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersList;
