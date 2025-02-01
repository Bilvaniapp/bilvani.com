import React, { useEffect, useState,useRef } from "react";
import { BASE_URL } from "../../../../../helper/helper";
import "./all-product.css";
import AdminHeader from "../../../admin-header/admin-header";
import axios from "axios";


////! Price ui pending or Discount Pending auto
const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productDetails, setProductDetails] = useState({
    title: "",
    actualPrice: "",
    discountedPrice: "",
    discount: "",
    description: "",
    returnPolicy: "",
    outOfStock: false,
    colors: "",
    category: "",
    subcategories: [],
    images: [],
  });
  const [imageError, setImageError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const successAudioRef = useRef(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/create-product/get/all/product`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bilvani/get/category`);
      setCategories(response.data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  // Fetch subcategories based on category selection
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bilvani/get/${categoryId}/subcategories`
      );
      setSubcategories(response.data);
    } catch (error) {
      setError("Error fetching subcategories");
    }
  };

  const handleEditClick = (product) => {
    setSelectedProductId(product._id);

    setProductDetails({
      title: product.title,
      actualPrice: product.actualPrice,
      discountedPrice: product.discountedPrice,
      discount: product.discount,
      description: product.description,
      returnPolicy: product.returnPolicy,
      outOfStock: product.outOfStock,
      colors: product.colors?.join(", "),
      category: product.category,
      subcategories: product.subcategories,
      images: product.images || [],
    });

    if (product.category) {
      fetchSubcategories(product.category);
    }
    setEditModalOpen(true);
    setSelectedImages([]);
    setImageError("");
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();

    if (imageError) {
      return;
    }

    const formData = new FormData();
    formData.append("title", productDetails.title);
    formData.append("actualPrice", productDetails.actualPrice);
    formData.append("discountedPrice", productDetails.discountedPrice);
    formData.append("discount", productDetails.discount);
    formData.append("description", productDetails.description);
    formData.append("returnPolicy", productDetails.returnPolicy);
    formData.append("outOfStock", productDetails.outOfStock);
    formData.append(
      "colorHexCodes",
      productDetails.colors.split(",").map((color) => color.trim())
    );
    formData.append("category", productDetails.category);
    formData.append(
      "subcategories",
      JSON.stringify(productDetails.subcategories)
    );

    productDetails.images.forEach((image) => {
      formData.append("existingImages[]", image);
    });

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/create-product/update-product/${selectedProductId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProductId ? response.data.product : product
          )
        );
        setSuccessMessage("Product updated successfully.");
        setEditModalOpen(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle removing images
  const removeImage = (index) => {
    if (productDetails.images.length <= 1) {
      setImageError("At least one image is mandatory.");

      setTimeout(() => {
        setImageError("");
      }, 1000);

      return;
    }

    setProductDetails((prevDetails) => ({
      ...prevDetails,
      images: prevDetails.images.filter((_, i) => i !== index),
    }));

    setImageError("");
  };

  const filteredProducts = products.filter((product) =>
    (product.productId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleSubcategoryChange = (e) => {
    const selectedValue = e.target.value;

    setProductDetails((prevDetails) => ({
      ...prevDetails,
      subcategories: selectedValue ? [selectedValue] : [], 
    }));
  };



  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/create-product/delete-product/${selectedProductId}`
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== selectedProductId)
      );
      setSuccessMessage("Product deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setModalOpen(false);
      setSelectedProductId(null);
    }
  };


  
  useEffect(() => {
    if (successMessage) {
  
      if (successAudioRef.current) {
        successAudioRef.current.play();
      }

      const timer = setTimeout(() => {
        setSuccessMessage(""); 
      }, 1000);

     

      return () => {
        clearTimeout(timer);
        if (successAudioRef.current) {
          successAudioRef.current.pause();
          successAudioRef.current.currentTime = 0; 
        }
      };
    }
  }, [successMessage]);


  return (
    <div className="putHeader">
      <AdminHeader />
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <h2 className="admin-dashboard-title">Product Inventory</h2>
          <audio ref={successAudioRef} src="/success-sound.mp3" />
          <div className="admin-dashboard-summary">
            <div className="admin-dashboard-card">
              <h2>Total Products</h2>
              <p>{products.length}</p>
            </div>
            <div className="admin-dashboard-card">
              <h2>Out of Stock</h2>
              <p>{products.filter((product) => product.outOfStock).length}</p>
            </div>
            <div className="admin-dashboard-card">
              <h2>In Stock</h2>
              <p>{products.filter((product) => !product.outOfStock).length}</p>
            </div>
          </div>
        </div>
        {successMessage && (
          <p className="toast toast-success">{successMessage}</p>
        )}
        {imageError && <p className="toast toast-error">{imageError}</p>}{" "}
        <div className="admin-product-controls">
          <input
            type="text"
            className="admin-product-search"
            placeholder="Search Products by ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts
              .slice(
                (currentPage - 1) * productsPerPage,
                currentPage * productsPerPage
              )
              .map((product) => (
                <tr key={product._id}>
                  <td>{product.productId}</td>
                  <td>{product.title}</td>
                  <td>₹{product.discountedPrice}</td>
                  <td
                    className={product.outOfStock ? "out-of-stock" : "in-stock"}
                  >
                    {product.outOfStock ? "Out of Stock" : "In Stock"}
                  </td>
                  <td>
                    <button
                      className="admin-edit-btn"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-delete-btn"
                      onClick={() => {
                        setSelectedProductId(product._id);
                        setModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmation</h2>
              <p>Are you sure you want to delete this product?</p>
              <div className="modal-buttons-admin">
                <button onClick={() => setModalOpen(false)}>Cancel</button>
                <button onClick={confirmDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
        {editModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content-admin">
              <h2>Edit Product</h2>
              <h3 className="product-form-title">Upload Product Image</h3>
              <label htmlFor="file-upload" className="custom-upload-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & Drop files here or click to browse</p>
              </label>
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleImageSelect}
              />
              {imageError && <p className="toast toast-error">{imageError}</p>}{" "}
              <div className="selected-images-preview">
                {selectedImages.length > 0 && <h3>Selected Images:</h3>}
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    style={{ width: "100px", height: "100px", margin: "5px" }}
                  />
                ))}
              </div>
              <form onSubmit={updateProduct} className="modal-form-admin">
                <div className="form-left">
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      value={productDetails.title}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Actual Price</label>
                    <input
                      type="number"
                      value={productDetails.actualPrice}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          actualPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Discounted Price</label>
                    <input
                      type="number"
                      value={productDetails.discountedPrice}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          discountedPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      value={productDetails.discount}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          discount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-right">
                  <div>
                    <label>Product Images</label>
                    <div className="product-images-admin">
                      {productDetails.images.length > 0 && (
                        <div className="image-preview-container">
                          {productDetails.images.map((image, index) => (
                            <div key={index} className="image-preview">
                              <img
                                src={image}
                                alt={`Product Image ${index + 1}`}
                              />
                              <button
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label>Description</label>
                    <textarea
                      value={productDetails.description}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Return Policy</label>
                    <textarea
                      value={productDetails.returnPolicy}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          returnPolicy: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Out of Stock</label>
                    <input
                      type="checkbox"
                      checked={productDetails.outOfStock}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          outOfStock: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Colors (comma separated)</label>
                    <input
                      type="text"
                      value={productDetails.colors}
                      onChange={(e) =>
                        setProductDetails({
                          ...productDetails,
                          colors: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      value={productDetails.category}
                      readOnly
                    />
                  </div>

                  {productDetails.subcategories.length > 0 && (
                    <div>
                      <label>Subcategories</label>
                      <input
                        type="text"
                        value={
                          Array.isArray(productDetails.subcategories)
                            ? productDetails.subcategories.join(", ")
                            : typeof productDetails.subcategories === "string"
                            ? productDetails.subcategories.replace(
                                /[\[\]"\\]/g,
                                ""
                              ) 
                            : productDetails.subcategories
                        }
                        readOnly
                      />
                    </div>
                  )}

                  <label>Category:</label>
                  <select
                    onChange={(e) => {
                      const selectedCategory = categories.find(
                        (cat) => cat._id === e.target.value
                      );
                      setProductDetails({
                        ...productDetails,
                        category: selectedCategory ? selectedCategory.name : "",
                        subcategories: [],
                      });

                      // Fetch subcategories for the selected category
                      fetchSubcategories(e.target.value);
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {subcategories.length > 0 && ( // Only show if there are subcategories
                    <div>
                      <label>Subcategory</label>
                      <select onChange={handleSubcategoryChange}>
                        <option value="">Select Subcategory</option>{" "}
                        {/* Placeholder option */}
                        {subcategories.map((subcategory) => (
                          <option
                            key={subcategory._id}
                            value={subcategory.name}
                          >
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="modal-footer-admin">
                  <button type="submit">Update Product</button>
                  <button type="button" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsList;
