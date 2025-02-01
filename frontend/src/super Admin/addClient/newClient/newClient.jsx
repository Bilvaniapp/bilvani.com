import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../../admin-component/admin-internal/admin-header/admin-header";
import { BASE_URL } from "../../../helper/helper";
import "./newClient.css";

const NewClient = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    billingAddress: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    email: "",
    phoneNo: "",
    contactNo: "",
    panNo: "",
    gstin: "",
    password: "",
    type: "",
    openingBalance: "",
    category: "",
    underCategory: "",
    creditAllowed: false,
    creditLimit: "",
    remark: "",
    clientId: "",
  });

  const [categoryAClients, setCategoryAClients] = useState([]); // Clients under Category A
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCategoryAClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/client/categoryA`);
      setCategoryAClients(response.data || []);
    } catch (error) {
      console.error(
        "Error fetching Category A clients:",
        error.response || error.message
      );
      setErrorMessage("Failed to load Category A clients.");
    }
  };

  useEffect(() => {
    fetchCategoryAClients();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        underCategory: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: updatedValue,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (
        ["B", "C", "D"].includes(formData.category) &&
        !formData.underCategory
      ) {
        setErrorMessage("Please select an under category for the client.");
        return;
      }

      await axios.post(`${BASE_URL}/api/admin/client/create`, formData);

      alert("Client information has been successfully saved!");
      setFormData({
        fullName: "",
        billingAddress: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        email: "",
        phoneNo: "",
        contactNo: "",
        panNo: "",
        gstin: "",
        password: "",
        type: "",
        openingBalance: "",
        category: "",
        underCategory: "",
        creditAllowed: false,
        creditLimit: "",
        remark: "",
        clientId: "",
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="putHeader">
      <AdminHeader />

      <div className="container">
        <h4 className="m-heading">Create New Client</h4>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="m-form grid-form">
          <div className="form-field-m">
            <label className="label-m">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Client Id:</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Phone No:</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Store Address:</label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Pin Code:</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">PAN No:</label>
            <input
              type="text"
              name="panNo"
              value={formData.panNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">GSTIN:</label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div className="form-field-m">
            <label className="label-m">Opening Balance:</label>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-m">
            <label className="label-m">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {["B", "C", "D"].includes(formData.category) && (
            <div className="form-field-m">
              <label className="label-m">Under Category:</label>
              <select
                name="underCategory"
                value={formData.underCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Under Category</option>
                {categoryAClients.length > 0 ? (
                  categoryAClients.map((client) => (
                    <option key={client._id} value={client.fullName}>
                      {client.fullName}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading Category A clients...</option>
                )}
              </select>
            </div>
          )}

          <div className="form-field-m">
            <label className="label-m">Remark:</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
          </div>

          <div
            className="form-field-m"
            style={{ gridColumn: "span 2", textAlign: "center" }}
          >
            <button className="btn-m" type="submit" style={{ width: "300px" }}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClient;
