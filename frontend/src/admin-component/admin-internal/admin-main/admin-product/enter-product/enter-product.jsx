import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./enter-product.css";
import { BASE_URL } from "../../../../../helper/helper";
import AdminHeader from "../../../admin-header/admin-header";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    productId: "",
    actualPrice: "",
    discountedPrice: "",
    discount: "",
    description: "",
    returnPolicy: "",
    outOfStock: false,
    colorHexCodes: "",
    category: "",
    subcategories: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const successAudioRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      if (selectedCategory) {
        setFormData((prevData) => ({
          ...prevData,
          category: selectedCategory.name, // Save category name instead of _id
          subcategories: "", // Reset subcategory when category changes
        }));
        fetchSubcategories(selectedCategory._id); // Fetch subcategories based on category _id
      } else {
        setFormData((prevData) => ({
          ...prevData,
          category: "",
          subcategories: "",
        }));
      }
    }

    if (name === "subcategories") {
      const selectedSubcategory = subcategories.find(
        (sub) => sub._id === value
      );
      if (selectedSubcategory) {
        setFormData((prevData) => ({
          ...prevData,
          subcategories: selectedSubcategory.name, // Save subcategory name instead of _id
        }));
      }
    }

    if (name !== "category" && name !== "subcategories") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const actualPrice = parseFloat(formData.actualPrice);
    const discountedPrice = parseFloat(formData.discountedPrice);

    if (!isNaN(actualPrice) && !isNaN(discountedPrice) && actualPrice > 0) {
      const discountPercentage =
        ((actualPrice - discountedPrice) / actualPrice) * 100;
      setFormData((prevData) => ({
        ...prevData,
        discount: discountPercentage.toFixed(2),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        discount: "",
      }));
    }
  }, [formData.actualPrice, formData.discountedPrice]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 2) {
      setErrorMessage("Max image upload only 2");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
        formDataToSend.append(key, formData[key]);
    }
    for (const file of images) {
        formDataToSend.append("images", file);
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/create-product`,
            formDataToSend,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setResponseMessage(response.data.message);

        // Navigate after setting the response message
        setTimeout(() => {
            navigate('/admin-bilvani-all-product');
        }, 1000); // Adjust the timeout duration as needed
    } catch (error) {
        setResponseMessage(
            error.response?.data?.error || "Something went wrong!"
        );
    }
};


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bilvani/get/category`);
      setCategories(response.data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      setFormData((prevData) => ({ ...prevData, subcategories: "" }));
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/get/${categoryId}/subcategories`
      );
      setSubcategories(response.data);
      setFormData((prevData) => ({ ...prevData, subcategories: "" }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories(formData.category);
  }, [formData.category]);



  
  useEffect(() => {
    if (responseMessage) {
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play();
      }

      const timer = setTimeout(() => {
        setResponseMessage(""); // Clear success message after timeout
      }, 1000);

     

      return () => {
        clearTimeout(timer);
        // Stop the sound when success message is cleared
        if (successAudioRef.current) {
          successAudioRef.current.pause();
          successAudioRef.current.currentTime = 0; // Reset sound
        }
      };
    }
  }, [responseMessage]);

  
  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="product-upload-container">
        <audio ref={successAudioRef} src="/success-sound.mp3" />
        <div className="product-form-wrapper">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h3 className="product-form-title">Upload Product Image</h3>
            <label htmlFor="file-upload" className="custom-upload-label">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag & Drop files here or click to browse</p>
            </label>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
            />
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <div className="image-preview-wrapper">
              {images.map((image, index) => (
                <div key={index} className="image-container">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="product-info-section">
              <h3 className="product-form-title">Product Information</h3>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                placeholder="Product Id"
                required
                className="custom-input-field"
              />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product Title"
                required
                className="custom-input-field"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product Description"
                className="custom-textarea"
              />

              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                placeholder="Product Price "
                required
                className="custom-input-field"
              />
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                placeholder="Offer Price"
                required
                className="custom-input-field"
              />
              <input
                type="number"
                name="discount"
                value={formData.discount}
                readOnly // Make discount read-only
                placeholder="Discount Auto Filled (%)"
                className="custom-input-field"
              />

              <textarea
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleInputChange}
                placeholder="Return Policy"
                className="custom-textarea"
              />

              {/* Category Select Dropdown */}
              <select
                name="category"
                value={
                  categories.find((cat) => cat.name === formData.category)
                    ?._id || ""
                }
                onChange={handleInputChange}
                className="category-select"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {formData.category && subcategories.length > 0 && (
                <select
                  name="subcategories"
                  className="subcategory-select"
                  value={
                    subcategories.find(
                      (sub) => sub.name === formData.subcategories
                    )?._id || ""
                  }
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              )}

              
            </div>

            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                name="outOfStock"
                checked={formData.outOfStock}
                onChange={() =>
                  setFormData({
                    ...formData,
                    outOfStock: !formData.outOfStock,
                  })
                }
              />{" "}
              Out of Stock
            </label>
            <button
              type="submit"
              className="custom-submit-btn"
            
            >
              Create Product
            </button>
          </form>
        </div>
        {responseMessage && (
          <p className="toast toast-success">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
