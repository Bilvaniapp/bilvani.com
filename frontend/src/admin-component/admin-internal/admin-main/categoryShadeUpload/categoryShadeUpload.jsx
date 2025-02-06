import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../helper/helper";
import "./categoryShadeUpload.css";
import { BASE_URL } from "../../../../helper/helper";
import AdminHeader from "../../admin-header/admin-header";

const CategoryShade = () => {
  const [formData, setFormData] = useState({
    name: "",
    mrp: "",
    discountPrice: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [currentProduct, setCurrentProduct] = useState(null);

  // const handleInputChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: files ? files[0] : value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "images") {
      // Check if an image file is uploaded
      setFormData({
        ...formData,
        images: files && files.length > 0 ? files[0] : formData.images, // Retain the existing image if no file is selected
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setImages((prev) => [...prev, ...files]);

    // Generate preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previewUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("mrp", formData.mrp);
      data.append("discountPrice", formData.discountPrice); // Ensure this is a string

      // Append images to FormData
      images.forEach((file) => data.append("images", file)); // 'images' should match the backend field name

      const response = await axios.post(
        `${BASE_URL}/api/category/shade/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Product added successfully!");
        // Reset the form
        setFormData({ name: "", mrp: "", discountPrice: "" });
        setImages([]);
        setPreviewImages([]);
      }
    } catch (error) {
      alert("Error adding product: " + error.message);
    }
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/shade/get`);
        if (response.data.success) {
          setProducts(response.data.data); // Assuming you have a state variable `products` and a setter `setProducts`
        } else {
          console.log("No products found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/category/shade/delete/${productId}`
      );
      if (response.data.success) {
        console.log("Product deleted successfully:", response.data.data);
        // Update the products state by filtering out the deleted product
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.error("Failed to delete product:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const [modalFormData, setModalFormData] = useState({
    name: "",
    mrp: "",
    discountPrice: "",
    images: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (product) => {
    setCurrentProduct(product); // Save the clicked product data, including its ID
    setFormData({
      name: product.name,
      mrp: product.mrp,
      discountPrice: product.discountPrice,
      images:product.images, // Reset images, as they will be uploaded if changed
    });
    setIsModalOpen(true); // Open the modal
  };
  
  


  const handleUpdateProduct = async () => {
    if (!currentProduct || !currentProduct._id) {
      alert("Product ID is missing.");
      return;
    }
  
    const form = new FormData();
    form.append("name", formData.name);
    form.append("mrp", formData.mrp);
    form.append("discountPrice", formData.discountPrice);
  
    // Include the image in the form data
    if (formData.images instanceof File) {
      // If a new image is selected, append the File object
      form.append("images", formData.images);
    } else if (formData.images) {
      // If no new image is selected, append the current image path
      form.append("images", formData.images);
    }
  
    try {
      const response = await axios.put(
        `${BASE_URL}/api/category/shade/update/${currentProduct._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        console.log("Product updated successfully:", response.data.data);
  
        // Update the product in the state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === currentProduct._id
              ? {
                  ...product,
                  ...response.data.data,
                  images: formData.images instanceof File
                    ? response.data.data.images // Use updated image from response if new image is uploaded
                    : product.images, // Retain the old image if no new image is uploaded
                }
              : product
          )
        );
  
        setIsModalOpen(false);
      } else {
        console.error("Failed to update product:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "An error occurred: " + (error.response?.data?.message || error.message)
      );
    }
  };
  
  
  
  
  
  
  

  const handleModalSubmit = () => {
    // You can update `formData` or perform other actions with `modalFormData` here.
    setFormData(modalFormData); // Optional: sync back if required
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentRows = products.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  
  return (
    <>
      <div className="putHeader">
        <AdminHeader />
        <div className="container">
          <h2 className="category-shade__title_Tarsh">Add New Product</h2>
          <form onSubmit={handleSubmit} className="category-shade__form_Tarsh">
            <div className="category-shade__form-group_Tarsh">
              <label htmlFor="name" className="category-shade__label_Tarsh">
                Product Name:
              </label>
              <input
                className="category-shade__input_Tarsh"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="category-shade__form-group_Tarsh">
              <label htmlFor="mrp" className="category-shade__label_Tarsh">
                MRP:
              </label>
              <input
                className="category-shade__input_Tarsh"
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="category-shade__form-group_Tarsh">
              <label
                htmlFor="discountPrice"
                className="category-shade__label_Tarsh"
              >
                Discount Price:
              </label>
              <input
                className="category-shade__input_Tarsh"
                type="text"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="category-shade__form-group_Tarsh">
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="category-shade__file-input_Tarsh"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <button className="category-shade__submit-btn_Tarsh" type="submit">
              Add Product
            </button>
          </form>

          <h2
            className="category-shade__title_Tarsh"
            style={{ marginTop: "40px" }}
          >
            All Products
          </h2>

          {/* table part  */}
          <div className="table-container-Tarsh">
      <table className="product-table-Tarsh">
        <thead className="product-table-header-Tarsh">
          <tr className="product-table-header-row-Tarsh">
            <th className="product-name-column-Tarsh">Product Name</th>
            <th className="product-mrp-column-Tarsh">MRP</th>
            <th className="product-discount-price-column-Tarsh">
              Discount Price
            </th>
            <th className="product-image-column-Tarsh">Image</th>
            <th className="product-actions-column-Tarsh">Actions</th>
          </tr>
        </thead>
        <tbody className="product-table-body-Tarsh">
          {currentRows.length > 0 ? (
            currentRows.map((product) => (
              <tr key={product._id} className="product-row-Tarsh">
                <td className="product-name-Tarsh">{product.name}</td>
                <td className="product-mrp-Tarsh">{product.mrp}</td>
                <td className="product-discount-price-Tarsh">
                  {product.discountPrice}
                </td>
                <td className="product-image-Tarsh">
                  <img
                    src={`${BASE_URL}${product.images[0]}`}
                    alt={product.name}
                    className="product-image-img-Tarsh"
                  />
                </td>
                <td className="product-actions-Tarsh">  
                <button
  className="edit-btn-Tarsh"
  onClick={() => handleEditClick(product)}
>
  Edit
</button>

                  <button
                    className="delete-btn-Tarsh"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-products-message-Tarsh">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-buttons-Tarsh">
        <button
          className="previous-btn-Tarsh"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="next-btn-Tarsh"
          onClick={handleNextPage}
          disabled={currentPage * rowsPerPage >= products.length}
        >
          Next
        </button>
      </div>
    </div>

    
    {isModalOpen && (
  <div className="modal-Tarsh">
    <div className="modal-content-Tarsh">
      <h2 className="modal-title-Tarsh">Edit Product</h2>

      <label className="modal-label-Tarsh">
        Product Name:
        <input
          className="modal-input-Tarsh"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>

      <label className="modal-label-Tarsh">
        MRP:
        <input
          className="modal-input-Tarsh"
          type="number"
          name="mrp"
          value={formData.mrp}
          onChange={handleInputChange}
        />
      </label>

      <label className="modal-label-Tarsh">
        Discount Price:
        <input
          className="modal-input-Tarsh"
          type="number"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleInputChange}
        />
      </label>

      <label className="modal-label-Tarsh">
        Images:
        <div className="image-preview-container-Tarsh">
          {formData.images && !(formData.images instanceof File) ? (
            // Display the current image if no new file is chosen
            <img
            src={`${BASE_URL}${formData.images[0]}`}
             
              alt={formData.name}
              className="image-preview-Tarsh"
              style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "8px" }}
            />
          ) : formData.images instanceof File ? (
            // Display preview of the new image
            <p>New image selected</p>
          ) : (
            <p>No image available</p>
          )}
        </div>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          onChange={handleInputChange}
          className="category-shade__file-input_Tarsh"
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </label>

      <button className="modal-button-Tarsh" onClick={handleUpdateProduct}>
        Update
      </button>
      <button
        className="modal-button-Tarsh"
        onClick={() => setIsModalOpen(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}


        </div>
      </div>
    </>
  );
};

export default CategoryShade;
