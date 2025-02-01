import { useState, useEffect } from "react";
import axios from "axios";
import "./singleProductAddress.css";
import { BASE_URL } from "../../helper/helper";
import { useParams, useNavigate } from "react-router-dom";
import Homepage from "../homePage/homepage";

const OrdersComponent = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    phoneNumber: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    city: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [hideUnselected, setHideUnselected] = useState(false);
  const [hasDelivered, setHasDelivered] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [showNewButton, setShowNewButton] = useState(true);
  const [itemCount, setItemCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
  const [showCouponPrice, setShowCouponPrice] = useState(false);
  const [error, setError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get`, {
          withCredentials: true,
        });
        setOrders(response.data);
        if (response.data.length > 0) {
          setSelectedOrderIndex(0);
          setFormData(response.data[0]);
        } else {
          setIsNewOrder(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createPayment = async () => {
    try {
      setPaymentLoading(true);
      const amountToPay = discountedPrice || totalPrice;
      const response = await axios.post(`${BASE_URL}/createrazor`, {
        amount: amountToPay * 100,
      });

      if (response.data.success) {
        const { order } = response.data;
        const options = {
          key: "rzp_test_4bOOuV1CTln2bE",
          amount: order.amount,
          currency: order.currency,
          name: "BILVANI ASK YOUR SHADE",
          order_id: order.id,
          handler: function (response) {
            console.log("Payment success:", response);
            sendSelectedOrder(response);
          },
          prefill: {
            name: order.customerFirstName,
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.log("Failed to create payment:", response.data.error);
      }
    } catch (error) {
      console.log("Error creating payment:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const sendSelectedOrder = async (paymentResponse) => {
    try {
      const selectedOrder = orders[selectedOrderIndex];
      const paymentData = {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        receivedSignature: paymentResponse.razorpay_signature,
        selectedOrder: selectedOrder,
        quantity: itemCount, // Include quantity in the payment data
        products: [
          {
            name: productDetails.name,
            discountedPrice: totalPrice,
            images: productDetails.images,
          },
        ],
      };
      await axios.post(`${BASE_URL}/verify-payment-confirmsave`, paymentData, {
        withCredentials: true,
      });
      navigate("/view-order/link==home_link&refrence==Bilvani");
    } catch (error) {
      console.log("Error sending selected order to backend:", error);
    }
  };

  const handleRadioChange = (index) => {
    setSelectedOrderIndex(index);
    setFormData(orders[index]);
    setEditModeIndex(null);
  };

  const handleOrderClick = (index) => {
    setSelectedOrderIndex(index);
    setFormData(orders[index]);
    setEditModeIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (index) => {
    setEditModeIndex(index);
    setFormData(orders[index]);
  };

  const handleSaveClick = async () => {
    try {
      const orderId = orders[editModeIndex]._id;
      const response = await axios.put(
        `${BASE_URL}/update-order-user-info/${orderId}`,
        formData,
        { withCredentials: true }
      );
      const updatedOrders = [...orders];
      updatedOrders[editModeIndex] = response.data;
      setOrders(updatedOrders);
      setEditModeIndex(null);
      console.log("Order updated successfully");
    } catch (error) {
      console.log("Error updating order:", error);
    }
  };

  const handleContinueClick = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/create-product/get-product-byId/${id}`
      );
      setProductDetails(response.data.product);

      setHideUnselected(true);
      setHasDelivered(true);
      setShowOrderSummary(true);
      setShowNewButton(false);
      setItemCount(1);
      setTotalPrice(response.data.product.discountedPrice);
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
  };

  const handleChangeClick = () => {
    setHideUnselected(false);
    setShowOrderSummary(false);
    setHasDelivered(false);
    setShowNewButton(true);
  };

  const handleNewOrderSubmit = async () => {
    try {
      if (
        !formData.customerFirstName ||
        !formData.customerLastName ||
        !formData.phoneNumber ||
        !formData.address ||
        !formData.pincode ||
        !formData.city ||
        !formData.district ||
        !formData.state
      ) {
        console.log("Please fill in all fields");
        return;
      }

      const orderData = {
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        pincode: formData.pincode,
        orderDate: new Date().toISOString(),
        city: formData.city,
        district: formData.district,
        state: formData.state,
      };

      const response = await axios.post(
        `${BASE_URL}/order-user-info`,
        orderData,
        { withCredentials: true }
      );
      console.log("New order created:", response.data);

      setOrders([...orders, response.data]);
      setIsNewOrder(false);
    } catch (error) {
      console.error("Error creating new order:", error);
    }
  };

  const handleNewOrderClick = () => {
    setFormData({
      customerFirstName: "",
      customerLastName: "",
      phoneNumber: "",
      address: "",
      district: "",
      state: "",
      pincode: "",
      city: "",
    });
    setEditModeIndex(null);
    setIsNewOrder(true);
  };

  const handleCancelNewOrderClick = () => {
    setIsNewOrder(false);
  };

  const handleDeleteClick = async (orderId, index) => {
    try {
      await axios.delete(`${BASE_URL}/delete-order-user-info/${orderId}`, {
        withCredentials: true,
      });
      const updatedOrders = orders.filter((_, i) => i !== index);
      setOrders(updatedOrders);
    } catch (error) {
      console.log("Error deleting order:", error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/getall/coupon`,
        {
          params: { couponCode },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const coupon = response.data;
        setCouponDiscountAmount(coupon.price);

        // Update total price considering the current quantity
        const newTotalPrice = productDetails.discountedPrice * itemCount;
        setTotalPrice(newTotalPrice);
        setDiscountedPrice(Math.max(newTotalPrice - coupon.price, 0));
        setShowCouponPrice(true);
        setIsCouponApplied(true);
        setError("");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError(`Your Coupon Code: ${couponCode} is Invalid`);
        } else if (error.response.status === 400) {
          setError(`Your Coupon Code: ${couponCode} is Expired`);
        } else {
          setError("An error occurred while applying the coupon.");
        }
      } else {
        console.error("Error applying coupon:", error);
        setError("Error applying coupon.");
      }
      setShowCouponPrice(false);
      setIsCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setTotalPrice(productDetails.discountedPrice * itemCount);
    setDiscountedPrice(0);
    setShowCouponPrice(false);
    setIsCouponApplied(false);
    setError("");
  };

  const increaseQuantity = () => {
    setItemCount((prevCount) => {
      const newCount = prevCount + 1;
      const newTotalPrice = productDetails.discountedPrice * newCount;
      setTotalPrice(newTotalPrice);
      
      if (isCouponApplied) {
        setDiscountedPrice(Math.max(newTotalPrice - couponDiscountAmount, 0));
      }
      return newCount;
    });
  };

  const decreaseQuantity = () => {
    setItemCount((prevCount) => {
      if (prevCount > 1) {
        const newCount = prevCount - 1;
        const newTotalPrice = productDetails.discountedPrice * newCount;
        setTotalPrice(newTotalPrice);
        // Apply coupon discount
        if (isCouponApplied) {
          setDiscountedPrice(Math.max(newTotalPrice - couponDiscountAmount, 0));
        }
        return newCount;
      }
      return prevCount;
    });
  };

  return (
    <div className="payment-address-main">
      <Homepage />
      <div className="forDisplayFlex_container container">
        <div className="orders-container">
          {loading ? (
            <div className="loading">Loading Address...</div>
          ) : (
            <>
              {!isNewOrder && orders.length > 0 ? (
                <div>
                  <h2 className="orders-title">Delivery Address : </h2>
                  <div className="orders-list">
                    {orders.map((order, index) => (
                      <div
                        key={index}
                        className={`order-card ${
                          hideUnselected && selectedOrderIndex !== index
                            ? "hidden"
                            : ""
                        }`}
                        onClick={() => handleOrderClick(index)}
                      >
                        <input
                          type="radio"
                          name="selectedOrder"
                          checked={selectedOrderIndex === index}
                          onChange={() => handleRadioChange(index)}
                        />
                        <div className="order-details">
                          <p className="order-name">
                            <strong>Name:</strong> {order.customerFirstName}
                          </p>
                          <p>{order.phoneNumber}</p>
                          <p className="order-address">{`${order.address}, ${order.district}, ${order.state} - ${order.pincode}`}</p>
                          {selectedOrderIndex === index &&
                            editModeIndex === null &&
                            !hasDelivered && (
                              <>
                                <button
                                  className="btn edit-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(index);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="continue-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContinueClick();
                                  }}
                                >
                                  Delivery Address
                                </button>
                                <button
                                  className="delete-button btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(order._id, index);
                                  }}
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          {hasDelivered && selectedOrderIndex === index && (
                            <button
                              className="change-button btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeClick();
                              }}
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {showOrderSummary && productDetails && (
                    <div className="order-summary">
                      <h3>Order Summary</h3>
                      <div className="product-summary-details">
                        <img
                          src={productDetails.images[0]}
                          alt="Product Image"
                          className="product-imagess"
                        />
                        <div className="product-info">
                          <p>
                            <strong>Product Name:</strong>{" "}
                            {productDetails.name}
                          </p>

                          {showCouponPrice && (
                            <p>
                              <strong>Discounted Price:</strong> ₹
                              {productDetails.discountedPrice -
                                couponDiscountAmount}
                            </p>
                          )}
                          <p>
                            {showCouponPrice ? (
                              <del style={{ textDecoration: "line-through" }}>
                                {" "}
                                <strong>Product Price:</strong> ₹
                                {productDetails.discountedPrice}
                              </del>
                            ) : (
                              <>
                                <strong>Product Price:</strong> ₹
                                {productDetails.discountedPrice}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        {!isCouponApplied ? (
                          <div className="coupon-container container">
                            <label>Enter Coupon:</label>
                            <input
                              type="text"
                              placeholder="Optional..."
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                              className="btn apply-btn"
                              onClick={handleApplyCoupon}
                              disabled={!couponCode} // Disable the button if couponCode is empty
                            >
                              Apply
                            </button>
                          </div>
                        ) : (
                          <div className="applied-coupon">
                            <span>{couponCode}</span>
                            <button
                              className="btn remove-coupon"
                              onClick={handleRemoveCoupon}
                            >
                              X
                            </button>
                          </div>
                        )}
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {showCouponPrice && (
                          <div className="showcoupon">
                            Coupon Applied: ₹{couponDiscountAmount}
                          </div>
                        )}
                      </div>

                      <div className="quantity-update">
                        <label>Quantity:</label>
                        <div className="quantity-control">
                          <button
                            onClick={decreaseQuantity}
                            className="btn for-quantity"
                          >
                            -
                          </button>
                          <span className="item-quantity">{itemCount}</span>

                          <button
                            onClick={increaseQuantity}
                            className="  btn for-quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        disabled={paymentLoading}
                        onClick={createPayment}
                        className="pay-button btn"
                      >
                        {paymentLoading ? "Processing..." : "Payment"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="new-order-form">
                  <h2>Add Address</h2>
                  <label>
                    First Name:
                    <input
                      type="text"
                      name="customerFirstName"
                      value={formData.customerFirstName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      name="customerLastName"
                      value={formData.customerLastName}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Phone Number:
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Address:
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    City:
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    District:
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    State:
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Pincode:
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button onClick={handleNewOrderSubmit}>Submit</button>
                  {orders.length > 0 && (
                    <button
                      onClick={handleCancelNewOrderClick}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
              {!isNewOrder && orders.length > 0 && showNewButton && (
                <button
                  onClick={handleNewOrderClick}
                  className="btn add_address"
                >
                  Add Address
                </button>
              )}
              {editModeIndex !== null && (
                <div className="modalsss_delivery">
                  <div className="modal-content__delivery">
                    <span
                      className="close"
                      onClick={() => setEditModeIndex(null)}
                    >
                      &times;
                    </span>
                    <h3>Delivery Address :</h3>
                    <label>
                      Name:
                      <input
                        type="text"
                        name="customerFirstName"
                        value={formData.customerFirstName}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Address:
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      District:
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      State:
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Pincode:
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </label>
                    <button onClick={handleSaveClick} className="save-button">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="price_details">
          <h3>Price details</h3>
          <hr />
          <div className="price-details">
            <p>
              <strong>Items:</strong> {itemCount}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{totalPrice}
            </p>
            {showCouponPrice && (
              <p>
                <>Discounted Price:</> -₹{couponDiscountAmount}
              </p>
            )}
            <p>
              <strong>Payable Amount:</strong> ₹{discountedPrice || totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersComponent;
