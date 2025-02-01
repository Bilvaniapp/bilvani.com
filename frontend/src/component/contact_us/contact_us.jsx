import React, { useState, useEffect } from "react";
import axios from "axios";
import "./contact_us.css";

import Homepage from "../homePage/homepage";
import Footer from "../footer/footer";
import { BASE_URL } from "../../helper/helper";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user details and pre-fill form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetail = await axios.get(`${BASE_URL}/user-details`, {
          withCredentials: true,
        });

        // Set fetched data in form fields
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: userDetail.data.name || "",
          email: userDetail.data.email || "",
        }));
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setResponseMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/api/contact-us`, formData);
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred while processing your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (responseMessage || errorMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [responseMessage, errorMessage]);

  return (
    <div style={{ background: "#F6D9D1" }} className="mainContact">
      <div className="container">
        <Homepage />
        <br />
        <br />
        <br />
        <div className="contact-form-container">
          <h2>Contact Us</h2>

          {responseMessage && (
            <p className="response-message">{responseMessage}</p>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your Message"
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactForm;
