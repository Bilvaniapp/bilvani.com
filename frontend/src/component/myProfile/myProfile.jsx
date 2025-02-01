import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../helper/helper";
import Modal from "react-modal";
import HomePage from "../homePage/homepage";
import "./myProfile.css";

const UserDetails = () => {
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    phoneNumber: "",
    address: "",
    pincode: "",
    email: "",
    city: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsResponse = await axios.get(
          `${BASE_URL}/user-details`,
          {
            withCredentials: true,
          }
        );
        setUserData(userDetailsResponse.data);

        const ordersResponse = await axios.get(`${BASE_URL}/get`, {
          withCredentials: true,
        });
        setOrders(ordersResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setFormData({
      customerFirstName: "",
      customerLastName: "",
      phoneNumber: "",
      address: "",
      pincode: "",
      email: "",
      city: "",
      district: "",
      state: "",
    });
    setIsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setFormData({
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      phoneNumber: order.phoneNumber,
      address: order.address,
      pincode: order.pincode,
      email: order.email,
      city: order.city,
      district: order.district,
      state: order.state,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveOrder = async () => {
    try {
      if (selectedOrder) {
        await axios.put(
          `${BASE_URL}/update-order-user-info/${selectedOrder._id}`,
          formData,
          {
            withCredentials: true,
          }
        );

        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id ? { ...order, ...formData } : order
          )
        );
      } else {
        const newOrderResponse = await axios.post(
          `${BASE_URL}/order-user-info`,
          formData,
          {
            withCredentials: true,
          }
        );

        setOrders([...orders, newOrderResponse.data]);
      }

      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.log("Error saving order:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-order-user-info/${orderId}`, {
        withCredentials: true,
      });

      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.log("Error deleting order:", error);
    }
  };

  return (
    <>
      <HomePage />
      <div className="account-detail-container">
        <div className="container-fluid">
          <div className="personal-container">
            <div className="header">
              <h2>Welcome, {userData.name}</h2>
            </div>
            <div className="user-details">
              <h2>Personal Information :</h2>
              <div className="order-item">
                <p>
                  <strong>Name: </strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.phone}
                </p>
              </div>
            </div>
            <div className="orders">
              <h2>Manage Orders : </h2>
              <button className="btn btn-success" onClick={handleNewOrder}>
                Add New Address
              </button>
              <div>
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-info">
                      <p>
                        <strong>Customer Name: </strong>
                        {order.customerFirstName}
                      </p>
                      <p>
                        <strong>Phone Number: </strong>
                        {order.phoneNumber}
                      </p>
                      <p className="order-address">
                        <strong>Address: </strong>
                        {`${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}`}
                      </p>
                      <button
                        className="btn btn-success"
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2 "
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel={selectedOrder ? "Edit Address" : "New Address"}
            className=" modal address_change_modal"
            ariaHideApp={false}
          >
            <div className="modal-container">
              <h2>{selectedOrder ? "Edit Address" : "New Address"}</h2>
              <form>
                <div>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="customerFirstName"
                    value={formData.customerFirstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="customerLastName"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="District"
                  />
                </div>
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </form>
              <div className="modal-buttons">
                <button className="save-btn" onClick={handleSaveOrder}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
