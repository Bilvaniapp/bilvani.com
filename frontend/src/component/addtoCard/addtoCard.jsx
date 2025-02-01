import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BASE_URL } from "../../helper/helper";
import "./addtoCard.css";
import HomePage from "../homePage/homepage";
import Footer from "../footer/footer";
import { Modal, Button, Form } from "react-bootstrap";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  const [totalUniqueProducts, setTotalUniqueProducts] = useState(0);
  const [totalPayablePrice, setTotalPayablePrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalActualPrice, setTotalActualPrice] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    customerFirstName: "",
    customerLastName: "",
    phoneNumber: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      const permanentId = Cookies.get("permanentId");
      if (!permanentId) {
        setError(
          "Permanent ID not found in cookies. Please login or register."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/cart-get`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setCartItems(response.data);
        calculateTotalPrice(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching cart items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("permanentId")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setOrders(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]._id);
        }
        setOrdersLoading(false);
      } catch (error) {
        
        setOrdersError("Error fetching orders. Please try again later.");
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateTotalPrice = (items) => {
    let total = 0;
    let savings = 0;
    let actualPrice = 0;
    let uniqueProducts = new Set();
    items.forEach((item) => {
      total += item.product.discountedPrice * item.quantity;
      savings +=
        (item.product.actualPrice - item.product.discountedPrice) *
        item.quantity;
      actualPrice += item.product.actualPrice * item.quantity;
      uniqueProducts.add(item.productId);
    });

    setTotalUniqueProducts(uniqueProducts.size);
    setTotalSavings(savings);
    setTotalPayablePrice(total);
    setTotalActualPrice(actualPrice);
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(
        `${BASE_URL}/update-cart`,
        {
          itemId: itemId,
          newQuantity: newQuantity,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) => {
      if (item._id === itemId) {
        updateCartItemQuantity(itemId, newQuantity);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const handleAddressChange = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    const otherOrders = orders.filter((order) => order._id !== orderId);
    setOrders([selectedOrder, ...otherOrders]);
    setSelectedAddress(orderId);
    setShowAllOrders(false);
    setShowModal(false);
  };

  const createPayment = async () => {
    if (!selectedAddress) {
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/createrazor`, {
        amount: totalPayablePrice * 100,
      });

      if (response.data.success) {
        const { order } = response.data;
        const options = {
          key: "rzp_test_4bOOuV1CTln2bE",
          amount: order.amount,
          currency: order.currency,
          name: "BILVANI ASK YOUR SHADE",
          order_id: order.id,
          prefill: {
            name: order.customerFirstName,
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
          handler: async function (response) {
            await verifyPayment(response);
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.log("Failed to create payment:", response.data.error);
      }
    } catch (error) {
      console.log("Error creating payment:", error);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    const selectedOrder = orders.find((order) => order._id === selectedAddress);

    const products = cartItems.map((item) => ({
      images: item.product.images,
      title: item.product.title,
      discountedPrice: item.product.discountedPrice,
      quantity: item.quantity,
    }));

    try {
      const response = await axios.post(
        `${BASE_URL}/verify-payment-confirmsave`,
        {
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          receivedSignature: paymentResponse.razorpay_signature,
          selectedOrder: selectedOrder,
          products: products,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(
          "Payment verified and order confirmed:",
          response.data.message
        );
        navigate("/view-order/link==home_link&refrence==Bilvani");
      } else {
        console.log("Payment verification failed:", response.data.error);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-cart/${itemId}`, {
        withCredentials: true,
      });

      const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
      window.location.href = "/viewcart/exploreMode==true&refrence=Bilvani";
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const permanentId = Cookies.get("permanentId");
      const response = await axios.post(
        `${BASE_URL}/order-user-info`,
        {
          ...newAddress,
          permanentId,
        },
        {
          withCredentials: true,
        }
      );
  
      // Update orders state and set selectedAddress
      setOrders([...orders, response.data]);
      setSelectedAddress(response.data._id);
      setShowModal(false); // Close the modal
      window.location.reload()
    } catch (error) {
      console.error("Error creating new address:", error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-main-container">
      <div className="cart-main-container">
        <HomePage />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="orders-section empty_order">
              <img src="/card_empty.webp" alt="" />
            </div>
          ) : (
            <>
              {ordersLoading ? (
                <div>Loading orders...</div>
              ) : ordersError ? (
                <div className="error_address">
                  <h2>Please Enter Address First From Profile</h2>
                </div>
              ) : (
                <div className="orders-sectionsss">
                  <h2>Your Orders</h2>
                  {orders.length === 0 ? (
                    <div>No orders found.</div>
                  ) : (
                    <>
                      {orders
                        .slice(0, showAllOrders ? orders.length : 1)
                        .map((order) => (
                          <div
                            key={order._id}
                            className="cart_order_address"
                            onClick={() => handleAddressChange(order._id)}
                          >
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={order._id}
                              checked={selectedAddress === order._id}
                              readOnly
                            />
                            <p>
                              Name: {order.customerFirstName}{" "}
                              {order.customerLastName}
                            </p>
                            <p className="order-address">{`${order.address}, ${order.district}, ${order.state} - ${order.pincode}`}</p>
                          </div>
                        ))}
                      {!showAllOrders && orders.length > 1 && (
                        <button
                          onClick={() => setShowModal(true)}
                          className="btn"
                        >
                          Change
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="cart-container">
                <div className="card-set">
                  <h2 className="WMMwb0">My Cart</h2>
                  <div>
                    <div className="cart-items">
                      {cartItems.map((item) => (
                        <div key={item._id} className="cart-item">
                          <div className="card_data_stored">
                            <Link to={`/product/${item.productId}`}>
                              <div className="cart-item-image">
                                {item.product && (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.title}
                                  />
                                )}
                              </div>
                            </Link>

                            <div className="cart-item-details">
                              <Link to={`/product/${item.productId}`}>
                                <p className="cardTitle">
                                  {item.product.title}
                                </p>
                              </Link>
                              <div className="quantity-control">
                                <button
                                  className="btn for-quantity"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </button>
                                <span className="item-quantity">
                                  {item.quantity}
                                </span>
                                <button
                                  className="btn for-quantity"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <p className="cart-item-price">
                                <span>₹</span>{" "}
                                {item.product.discountedPrice * item.quantity}{" "}
                                <span className="spanss">
                                  ₹{item.product.actualPrice}
                                </span>{" "}
                                <span className="card-offer-percentage">
                                  {(
                                    ((item.product.actualPrice -
                                      item.product.discountedPrice) /
                                      item.product.actualPrice) *
                                    100
                                  ).toFixed(2)}
                                  % off
                                </span>
                              </p>
                              <p className="savings">
                                You Save:{" "}
                                <span>
                                  ₹
                                  {(
                                    (item.product.actualPrice -
                                      item.product.discountedPrice) *
                                    item.quantity
                                  ).toFixed(2)}
                                </span>
                              </p>
                              <button
                                className="btn "
                                onClick={() => deleteCartItem(item._id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="my-card-price-detail">
                    <h2 className="WMMwb0">Price Details</h2>
                    <hr />
                    <div className="total-unique-products">
                      Price({totalUniqueProducts} Items) :{" "}
                      <span>₹{totalActualPrice.toFixed(2)}</span>
                    </div>
                    <div className="discount-price">
                      Discount : <span> - ₹{totalSavings.toFixed(2)}</span>
                    </div>
                    <div className="total-payable-price">
                      Total Amount :{" "}
                      <span>₹{totalPayablePrice.toFixed(2)}</span>
                    </div>
                    <button
                      className="btn place-cart-order"
                      onClick={createPayment}
                    >
                      Place Order
                    </button>
                  </div>
                  <div className="secured-cart">
                    <p>
                      <img
                        src="/secure.png"
                        alt="Secure_logo_loading"
                        className="img-fluid"
                        width="20px"
                      />
                      Safe and Secure Payments. Easy returns. <br /> BY BILVANI.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bootstrap Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {orders.length === 0 ? (
              <Form onSubmit={handleAddressSubmit}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerFirstName"
                    value={newAddress.customerFirstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerLastName"
                    value={newAddress.customerLastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={newAddress.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={newAddress.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>District</Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={newAddress.district}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group> <br />
                <Button type="submit">Save Address</Button>
              </Form>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="cart_order_address"
                  onClick={() => handleAddressChange(order._id)}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={order._id}
                    checked={selectedAddress === order._id}
                    readOnly
                  />
                  <p>
                    Name: {order.customerFirstName} {order.customerLastName}
                  </p>
                  <p className="order-address">{`${order.address}, ${order.district}, ${order.state} - ${order.pincode}`}</p>
                </div>
              ))
            )}
          </Modal.Body>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
