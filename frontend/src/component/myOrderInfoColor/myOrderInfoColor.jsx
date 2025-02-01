import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../helper/helper";
import { useParams } from "react-router-dom";
import "./myOrderInfoColor.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HomePage from "../homePage/homepage";
import Modal from "react-modal";
import Cookies from "js-cookie";
import{useNavigate} from 'react-router-dom'

Modal.setAppElement("#root");

const OrderDetailsColor = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bilvani/get/customcolororder/${orderId}`,
          { withCredentials: true }
        );
        setOrder(response.data.order);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.error
            : "Error fetching order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const generateInvoice = () => {
    if (!order) return;

    const doc = new jsPDF({ orientation: "landscape" });

    // Add logo image
    const logo = new Image();
    logo.src = "/Logo.png";
    doc.addImage(logo, "PNG", 10, 10, 60, 30);

    // Set custom font family and size
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BILVANI INVOICE", 140, 20, null, null, "center");

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 20, 50);
    doc.text(`Sold By: Bilvani`, 20, 60);
    doc.text(`GSTIN: GST-1234567890`, 20, 70);

    doc.setFontSize(14);
    doc.text("Shipping Address:", 200, 50);
    doc.setFontSize(12);
    doc.text(`${order.customerFirstName}`, 200, 60);
    doc.text(
      `${order.address}, ${order.district}, ${order.state} - ${order.pincode}`,
      200,
      70
    );
    doc.text(`Phone Number: ${order.phoneNumber}`, 200, 80);

    const tableColumn = ["Product Title", "Quantity", "Gross Price"];
    const tableRows = [];

    let totalQuantity = 0;

    order.products.forEach((product) => {
      const quantity = order.quantity || product.quantity;
      const productData = [
        product.title,
        ` ${quantity}`,
        ` ${product.discountedPrice}`,
      ];
      tableRows.push(productData);
      totalQuantity += quantity;
    });

    doc.autoTable({
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { halign: "center", font: "Helvetica", fontSize: 12 },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
    });

    // Total amount
    doc.setFontSize(14);
    doc.text(
      `Total Quantity: ${totalQuantity}`,
      20,
      doc.previousAutoTable.finalY + 10
    );
    doc.text(
      `Total Amount:  ${order.products.reduce(
        (total, product) => total + product.discountedPrice,
        0
      )}`,
      20,
      doc.previousAutoTable.finalY + 20
    );

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Thank you for your purchase! Visit Again BILVANI",
      140,
      doc.previousAutoTable.finalY + 30,
      null,
      null,
      "center"
    );

    // Save the PDF
    doc.save(`Bilvani_Invoice_${order.orderId}.pdf`);
  };

  const cancelOrder = async () => {
    setCancelLoading(true);
    setCancelError(null);

    try {
      await axios.post(
        `${BASE_URL}/cancel-order`,
        {
          originalOrderId: orderId,
          reason: cancelReason,
          additionalDetails: additionalDetails,
        },
        { withCredentials: true }
      );

      setOrder((prevOrder) => ({
        ...prevOrder,
        status: "cancelled",
      }));

      alert("Order has been cancelled successfully.");
      setModalIsOpen(false);
    } catch (err) {
      setCancelError(
        err.response ? err.response.data.error : "Error cancelling the order."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const repeatedorde = () => {
    if (!order) return; 
  
    const flattenedOrderData = order.products.flatMap((product, index) => {
      const singleQuantityPrice = product.Price / (order.quantity || 1); 
  
      return [
        { [`mixedColorHex`]: product.colorHex },
      { [`selectedCategory`]: product.name },
      { [`price`]: singleQuantityPrice.toFixed(2) },
      { [`lipstickType`]: product.base },
      { [`fragrance`]: product.fragnance }

      ];
    });
  
    
    const orderData = Object.assign({}, ...flattenedOrderData);
  
    Cookies.set("orderData", JSON.stringify(orderData), { expires: 2 }); 

    setTimeout(() => {
      Cookies.remove("orderData")
    
    }, Date.now() + 48 * 60 * 60 * 1000); //48 hours
    
    navigate("/colororder"); 
  };
  
  

  return (
    <div className="order-details-full">
      <HomePage />
      <div className="order-details-container container">
        {order ? (
          <div>
            <h3 className="section-title">Delivery Address</h3>
            <p>{order.customerFirstName}</p>
            <p className="address">{`${order.address}, ${order.district}, ${order.state} - ${order.pincode}`}</p>
            <p>Phone Number : {order.phoneNumber}</p>
            <p>Order ID: {order.orderId}</p>
            <p>Order Status: {order.status}</p>

            <h2 className="section-title ipad_device">Products:</h2>
            <div className="products-container">
              {order.products.map((product) => (
                <div
                  className="product-card-full-order-color"
                  key={product._id}
                >
                  <div
                    className="color-background"
                    style={{
                      backgroundColor: product.colorHex || "#fff",
                      width: "100px",
                      
                    }}
                  >
                    <p>Custom Shade</p>
                  </div>
                  <div className="product-infossss">
                    <p className="product-titlessss">Name: {product.name}</p>
                    <p><strong>Base:</strong> {product.base}</p>
                    <p><strong>Types:</strong> {product.fragnance}</p>
                    <p className="product-pricesssss">
                      <strong>Price:</strong> ₹{product.Price}
                    </p>
                    <p>
                      <strong>Quantity :</strong> {order.quantity}
                      {product.quantity}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={generateInvoice} className="download-invoice-btn">
              Download Invoice
            </button>
            {order.status !== "cancelled" && (
              <button
                onClick={() => setModalIsOpen(true)}
                className="cancel-order-btn btn"
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            {cancelError && <p className="error">{cancelError}</p>}

            <button className="btn repatedOrder" onClick={repeatedorde}>Repated Order</button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Cancel Order Modal"
              className="Modal"
              overlayClassName="Overlay"
            >
              <h2>Confirm Cancellation</h2>
              <p>Are you sure you want to cancel this order?</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  cancelOrder();
                }}
              >
                <label>
                  Reason for Cancellation:
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Additional Details:
                  <textarea
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={cancelLoading}>
                  {cancelLoading ? "Cancelling..." : "Yes, Cancel Order"}
                </button>
                <button type="button" onClick={() => setModalIsOpen(false)}>
                  No, Go Back
                </button>
              </form>
            </Modal>
          </div>
        ) : (
          <p>No order details available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsColor;
