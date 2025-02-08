import { useState, useEffect } from "react";
import axios from "axios";
import "./customColorOrder.css";
import { BASE_URL } from "../../helper/helper";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Homepage from "../homePage/homepage";

const customColorOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");

  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const [error, setError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [showCouponPrice, setShowCouponPrice] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [otp, setOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

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

      const finalPrice = discountedPrice || totalPrice;
      // Create payment order using your backend
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/create/online/payment`,
        {
          amount: finalPrice, // Send amount in INR, backend will convert to paise
        }
      );

      if (response.data.success) {
        const { orderId, amount, currency } = response.data;

        const options = {
          key: "rzp_live_q06hnW3knyeKv4", // Razorpay test key
          amount: amount,
          currency: currency,
          name: "BILVANI ASK YOUR SHADE",
          order_id: orderId,
          handler: async function (paymentResponse) {
            // After successful payment, send the order details to the backend
            try {
              // Prepare all addresses for the order
              const allAddresses = orders
                .map((order) => {
                  return `${order.address}, ${order.district}, ${order.state} - ${order.pincode}`;
                })
                .join("; "); // Use a delimiter like semicolon or comma to separate multiple addresses

              const selectedStore = JSON.parse(
                localStorage.getItem("selectedStore")
              );
              let storeAddress = "";

              // If selectedStore exists, construct the store address
              if (selectedStore) {
                storeAddress = `${selectedStore.billingAddress}, ${selectedStore.city}, ${selectedStore.state}`;
              }
              const userphoneNumber = orders[0]?.phoneNumber;
              // Prepare the order details to be sent to the backend
              const productDetailsData = {
                name: productDetails.title,
                base: productDetails.Types,
                type: productDetails.option,
                totalPrice: finalPrice,
                quantity: itemCount,
                mixColor:
                  parsedOrderData?.selectedColors?.mixedColorHex ||
                  "#0000000000",
                shade: parsedOrderData?.selectedColors?.colors || [],
                payment: {
                  method: "online",
                  paymentId: paymentResponse.razorpay_payment_id,
                },
                coupon: couponCode,
                storeAddress: storeAddress,
                userAddress: allAddresses,
                orderComplete: false,
                orderStatus: "accepted",
                phoneNumber:userphoneNumber
              };

              // Send order details for payment verification
              const verifyResponse = await axios.post(
                `${BASE_URL}/api/bilvani/verify/online/payment`,
                {
                  razorpay_order_id: orderId,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  productDetails: productDetailsData,
                },
                {
                  withCredentials: true,
                }
              );

              if (verifyResponse.data.success) {
                console.log("Order details sent to backend successfully");
                navigate("/view-order/link==home_link&refrence==Bilvani");
              } else {
                console.log(
                  "Payment verification failed:",
                  verifyResponse.data.message
                );
              }
            } catch (error) {
              console.log("Error sending order details to backend:", error);
            }
          },
          
          theme: {
            color: "#3399cc",
          },
        };

        // Open Razorpay payment window
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.log("Failed to create payment:", response.data.error);
        // Handle payment creation failure (e.g., display an error message)
      }
    } catch (error) {
      console.log("Error creating payment:", error);
      // Handle error (e.g., display an error message)
    } finally {
      setPaymentLoading(false);
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

  const increaseQuantity = () => {
    setItemCount((prevCount) => {
      const newCount = prevCount + 1;
      const newTotalPrice = productDetails.discountedPrice * newCount;

      setTotalPrice(newTotalPrice);

      if (isCouponApplied) {
        const discountAmount = (newTotalPrice * discountPercentage) / 100;
        setCouponDiscountAmount(discountAmount); // Update the coupon discount amount
        setDiscountedPrice(newTotalPrice - discountAmount);
      } else {
        setDiscountedPrice(newTotalPrice);
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

        if (isCouponApplied) {
          const discountAmount = (newTotalPrice * discountPercentage) / 100;
          setCouponDiscountAmount(discountAmount); // Update the coupon discount amount
          setDiscountedPrice(newTotalPrice - discountAmount);
        } else {
          setDiscountedPrice(newTotalPrice);
        }

        return newCount;
      }
      return prevCount;
    });
  };

  const [parsedOrderData, setParsedOrderData] = useState(null);

  const parseOrderDataFromCookies = () => {
    const orderData = Cookies.get("orderData");
    if (orderData) {
      try {
        const decodedData = decodeURIComponent(orderData);
        const parsedOrderData = JSON.parse(decodedData);
        setParsedOrderData(parsedOrderData);
        return parsedOrderData;
      } catch (error) {
        console.log("Error parsing order data from cookies:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    parseOrderDataFromCookies();
  }, []);

  const handleContinueClick = () => {
    const orderData = parseOrderDataFromCookies();
    if (orderData) {
      setParsedOrderData(orderData);
      if (orderData.selectedCategory && orderData.price) {
        const newProductDetails = {
          title: orderData.selectedCategory,
          discountedPrice: orderData.price,
          Types: orderData.lipstickType || orderData.glitterOption,
          option: orderData.glitterType || orderData.fragrance || "No Selected",
        };

        setProductDetails(newProductDetails);
        setTotalPrice(newProductDetails.discountedPrice * itemCount);

        setShowOrderSummary(true);
        setHideUnselected(true);
        setHasDelivered(true);
        setShowNewButton(false);
      } else {
        console.log("Missing required order data properties.");
      }
    } else {
      console.log("No order data found in cookies");
    }
  };

  const handleApplyCoupon = async (e) => {
    setResponseMessage("");
    setDiscountPercentage(null);
    setIsCouponApplied(false); // Reset the coupon applied state
    setDiscountedPrice(null); // Reset the discounted price

    if (!couponCode.trim()) {
      setResponseMessage("Please enter a valid coupon code.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/use/coupon`,
        { couponCode },
        { withCredentials: true } // Include cookies in the request
      );

      const { message, discountPercentage } = response.data;

      setResponseMessage(message);
      setDiscountPercentage(discountPercentage);

      // Calculate the discounted price
      if (discountPercentage) {
        const discountAmount = (totalPrice * discountPercentage) / 100;
        setDiscountedPrice(totalPrice - discountAmount);
        setCouponDiscountAmount(discountAmount); // Save the discount amount
      }

      setIsCouponApplied(true); // Mark coupon as applied
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      setResponseMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode(""); // Clear coupon code
    setDiscountedPrice(totalPrice); // Reset discountedPrice to totalPrice
    setShowCouponPrice(false); // Hide coupon price
    setIsCouponApplied(false); // Set coupon as not applied
    setResponseMessage(""); // Clear response message
    setError(""); // Clear error message
    setDiscountPercentage(null); // Reset discountPercentage
  };

  const handleCodClick = async () => {
    try {
      // Call the API to generate OTP
      const generateResponse = await axios.post(
        `${BASE_URL}/api/bilvani/generate/cod/otp`,
        {},
        { withCredentials: true }
      );

      if (generateResponse.status === 200) {
        // Fetch the generated OTP
        const fetchResponse = await axios.get(
          `${BASE_URL}/api/bilvani/generate/get/otp`,
          { withCredentials: true }
        );

        if (fetchResponse.status === 200) {
          const generatedOtp = fetchResponse.data.otp;
          setOtp(generatedOtp); // Set the OTP to display in the modal
          setShowOtpModal(true); // Show the modal
        } else {
          console.error("Failed to fetch OTP:", fetchResponse.data.error);
          alert("Failed to fetch OTP. Please try again.");
        }
      } else {
        console.error("Failed to generate OTP:", generateResponse.data.error);
        alert("Failed to generate OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error handling OTP:", error);
      alert("An error occurred while handling OTP. Please try again.");
    }
  };

  const handleOtpChange = (e) => {
    setEnteredOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    try {
      // Retrieve selectedStore from localStorage
      const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));

      const allAddresses = orders.map((order) => {
        return `${order.address}, ${order.district}, ${order.state} - ${order.pincode}`;
      });

      const userphoneNumber = orders[0]?.phoneNumber;
      // Initialize storeAddress as empty string in case selectedStore is not present
      let storeAddress = "";

      // If selectedStore exists, construct the store address
      if (selectedStore) {
        storeAddress = `${selectedStore.billingAddress}, ${selectedStore.city}, ${selectedStore.state}`;
      }

      const shades = Array.isArray(parsedOrderData?.selectedColors?.colors)
        ? parsedOrderData.selectedColors.colors.map((color) => ({
            hex: color.hex,
            shade: color.shade,
            intensity: color.intensity,
          }))
        : [];

      

      const mixedColorHex =
        parsedOrderData?.selectedColors?.mixedColorHex || "#0000000000";
      const finalPrice = discountedPrice || totalPrice;

      const productDetailsToSave = {
        name: productDetails.title, // Correct property if needed
        base: productDetails.Types,
        type: productDetails.option,
        totalPrice: finalPrice,
        quantity: itemCount,
        mixColor: mixedColorHex,
        shade: shades,
        payment: {
          method: "cash",
          paymentId: null, 
        },
        coupon: couponCode,
        storeAddress: storeAddress, 
        userAddress: allAddresses.join(", "),
        confirm: "pending", 
        orderComplete: false, 
        orderStatus: "in progress",
        phoneNumber:userphoneNumber,
      };

      // Send the OTP and order details to the backend
      const response = await axios.post(
        `${BASE_URL}/api/bilvani/verify/otp/order/confirmed`,
        {
          otp: enteredOtp, // OTP entered by the user
          productDetails: productDetailsToSave, // Send product details
        },
        { withCredentials: true } // Include cookies
      );

      if (response.status === 201) {
        setShowOtpModal(false);
        navigate("/view-order/link==home_link&refrence==Bilvani");
      } else {
        console.error("Failed to verify OTP:", response.data.error);
        // Handle failure smoothly without breaking the flow
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error smoothly without breaking the flow
    }
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
                          className="changeRadio"
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
                        <div className="product-info">
                          <p>
                            <strong>Product Name:</strong> Customized{" "}
                            {productDetails.title}
                          </p>
                          <p>
                            <strong>BASE:</strong> {productDetails.Types}
                          </p>
                          <p>
                            <strong>Types:</strong> {productDetails.option}
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

                          <p>
                            <strong>Your Shade:</strong>
                            <span
                              style={{
                                backgroundColor: parsedOrderData?.selectedColors
                                  ? parsedOrderData.selectedColors.mixedColorHex
                                  : "transparent",
                                padding: "5px 30px",
                                boxSizing: "border-box",
                                height: "150px",
                              }}
                            ></span>
                          </p>
                        </div>
                      </div>

                      <div>
                        {/* Coupon Section */}
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
                              disabled={!couponCode || isLoading} // Disable button if no couponCode or if loading
                            >
                              {isLoading ? "Applying..." : "Apply"}{" "}
                              {/* Show applying state */}
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

                        {/* Response and Error Messages */}
                        {responseMessage && (
                          <div
                            style={{
                              color: responseMessage.includes("valid")
                                ? "red"
                                : "green",
                              marginTop: "10px",
                            }}
                          >
                            {responseMessage}
                          </div>
                        )}

                        {/* Error Handling */}
                        {error && <div style={{ color: "red" }}>{error}</div>}

                        {/* Quantity Update Section */}
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
                              className="btn for-quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="btnContainerCod">
                        <button
                          className="btn codbtnCss"
                          onClick={handleCodClick}
                        >
                          Cod Order Place
                        </button>
                        <button
                          className="btn codbtnCss"
                          onClick={createPayment}
                        >
                          {" "}
                          {/* Call createPayment for online payment */}
                          Online Order Place
                        </button>
                      </div>
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
                <div className="modalsss">
                  <div className="modal-content">
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

        {showOtpModal && (
          <div className="modal_cod">
            <div className="modal-content_cod">
              <span className="close" onClick={() => setShowOtpModal(false)}>
                &times;
              </span>
              <h3>Enter OTP</h3>
              <p className="generated-otp">
                Your OTP: <strong>{otp}</strong>
              </p>
              <input
                type="text"
                value={enteredOtp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                className="otp-input"
              />
              <button className="btn" onClick={handleVerifyOtp}>
                Order Confirmed
              </button>
            </div>
          </div>
        )}

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
            {discountPercentage && (
              <p>
                <strong>Discount Applied ({discountPercentage}%):</strong> -₹
                {couponDiscountAmount}
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

export default customColorOrder;
