import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../helper/helper";
import AdminHeader from "../../admin-header/admin-header";
import { FaPen, FaTimes, FaEye, FaCheck } from "react-icons/fa";
import "./uploadeExcelShade.css";

const UploadShade = () => {
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [message, setMessage] = useState(""); // State to display success or error messages
  const [loading, setLoading] = useState(false); // Loading state for button

  const [colors, setColors] = useState([]); // State to hold fetched data
  const [error, setError] = useState(null); // State to handle errors
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [tempColors, setTempColors] = useState({}); // Store temporary input changes

  useEffect(() => {
    // Fetch colors from backend when the component is mounted
    const fetchColors = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bilvani/get/all/excel`
        );
        setColors(response.data); // Update state with colors data
      } catch (error) {
        console.error(
          "Error fetching colors:",
          error.response ? error.response.data : error.message
        );
        setMessage("Error fetching colors.");
      }
    };

    fetchColors(); // Call the function to fetch data
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage(""); // Clear previous messages when a new file is selected
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select an Excel file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage(""); // Clear previous messages

      // Send the Excel file to the backend
      const response = await axios.post(`${BASE_URL}/upload-excel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Display success message
      const successMessage =
        response.data ||
        `${response.data?.insertedCount || 0} colors inserted successfully.`;
      setMessage(successMessage);

      // Show an alert on successful upload
      alert("File uploaded successfully!");

      // Re-fetch the colors after a successful upload
      const updatedResponse = await axios.get(`${BASE_URL}/get-all-colors`);
      setColors(updatedResponse.data);
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response ? error.response.data : error.message
      );
      setMessage(
        error.response?.data ||
          "An error occurred while uploading or processing the file. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const paginatedColors = colors.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const [particulars, setParticulars] = useState([
    {
      colors: [
        {
          hex: "",
          shade: "",
          intensity: 0, // Assuming intensity is a number
        },
      ],
      mixedColorHex: "",
    },
  ]);

  const handleDeleteColor = async (colorId) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await axios.delete(`${BASE_URL}/api/bilvani/delete/${colorId}`);
        setColors(colors.filter((color) => color._id !== colorId)); // Update colors in the state
        setFilteredColors(
          filteredColors.filter((color) => color._id !== colorId)
        ); // Update filtered colors
      } catch (error) {
        console.error("Failed to delete color:", error);
        setErrorMessage("Failed to delete color. Please try again.");
      }
    }
  };





  return (
    <div className="putHeader">
      <AdminHeader />
      <div
        className="client-due-section"
        style={{
          maxWidth: "900px",
          margin: "auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Upload Excel File</h1>

        <form onSubmit={handleSubmit}>
          <div className="topForm" style={{ marginBottom: "15px" }}>
            <label
              htmlFor="file"
              className="top2"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Select Excel File
            </label>
            <input
              type="file"
              id="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="top2"
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="styled-button"
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#cccccc" : "#007BFF",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <div className="colors-table-container">
          <h2>Colors Table</h2>
          {error && <p className="error-message">{error}</p>}
          {paginatedColors.length > 0 ? (
            <>
              <div className="table-scrollable">
                <table className="colors-table">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Hex Code</th>
                      <th>Shade</th>
                      <th>Intensity</th>
                      <th>Mixed Color Hex</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedColors.map((color, index) => (
                      <tr key={color._id}>
                        <td>{currentPage * rowsPerPage + index + 1}</td>
                        <td>
                          {color.colors.map((c, i) => (
                            <input
                              key={i}
                              type="text"
                              value={c.hex}
                              readOnly={!color.isEditing}
                              className="hex-code-input"
                            />
                          ))}
                        </td>
                        <td>
                          {color.colors.map((c, i) => (
                            <input
                              key={i}
                              type="text"
                              value={c.shade}
                              readOnly={!color.isEditing}
                              className="shade-input"
                            />
                          ))}
                        </td>
                        <td>
                          {color.colors.map((c, i) => (
                            <input
                              key={i}
                              type="text"
                              value={c.intensity}
                              readOnly={!color.isEditing}
                              className="intensity-input"
                            />
                          ))}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={color.mixedColorHex}
                            readOnly={!color.isEditing}
                            className="mixed-color-hex-input"
                          />
                        </td>
                        <td>
                          <FaTimes
                            className="icon-m delete-icon-m"
                            onClick={() => handleDeleteColor(color._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination-controls">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="prev-button"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={(currentPage + 1) * rowsPerPage >= colors.length}
                  className="next-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="no-data-message">No data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadShade;
