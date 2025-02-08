import { useState } from "react";
import { BASE_URL } from "../../../../helper/helper";
import AdminHeader from "../../admin-header/admin-header";
import axios from "axios";

const CouponGen = () => {
  const [formData, setFormData] = useState({
    name: "",
    couponCode: "",
    expiryTime: "",
    percentage: "",
    isOneTimeUse: false,
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/bilvani/create/coupon`, formData);
      setResponseMessage(response.data.message);
      setFormData({
        name: "",
        couponCode: "",
        expiryTime: "",
        percentage: "",
        isOneTimeUse: false,
      });
    } catch (error) {
      console.error("Error creating coupon:", error);
      setResponseMessage(error.response?.data?.message || "Error creating coupon.");
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="container">
        <h2>Create Coupon</h2>
        {responseMessage && <p>{responseMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Coupon Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="couponCode">Coupon Code:</label>
            <input
              type="text"
              id="couponCode"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryTime">Expiry Time:</label>
            <input
              type="datetime-local"
              id="expiryTime"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleInputChange}
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="percentage">Discount Percentage:</label>
            <input
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isOneTimeUse"
                checked={formData.isOneTimeUse}
                onChange={handleInputChange}
              />
              One-Time Use
            </label>
          </div>

          <button type="submit" className="btn btn-primary">Create Coupon</button>
        </form>
      </div>
    </div>
  );
};

export default CouponGen;
