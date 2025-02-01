import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Homepage from "../homePage/homepage";
import "./selectedCategorytoColor.css";
import { BASE_URL } from "../../helper/helper";
import Footer from "../footer/footer";

const SelectedCategoryToColor = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedStore, setSelectedStore] = useState(""); // Store ID
  const [selectedLocation, setSelectedLocation] = useState(""); // New state for location
  const [locations, setLocations] = useState([]); // Unique locations
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(
          `${BASE_URL}/api/category/shade/get`
        );
        const categoryResult = await categoryResponse.json();
        if (categoryResponse.ok) {
          setCategories(categoryResult.data);
        } else {
          console.error(categoryResult.message);
        }

        const clientResponse = await fetch(
          `${BASE_URL}/api/admin/get/all/client`
        );
        const clientResult = await clientResponse.json();
        if (clientResponse.ok) {
          setClients(clientResult);
          const uniqueLocations = [
            ...new Set(clientResult.map((client) => client.city)),
          ];
          setLocations(uniqueLocations);
        } else {
          console.error(clientResult.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Restore selected category
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);

  const handleCategoryChange = (category, discountPrice) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
    localStorage.setItem("Price", discountPrice);
  };

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setSelectedStore(""); // Reset selected store when location changes
  };

  const handleSubmit = () => {
   

    // Find the selected client details
    const selectedClient = clients.find((client) => client._id === selectedStore);

    if (selectedClient) {
      // Save the selected store, billing address, city, and state to localStorage
      const storeDetails = {
        billingAddress: selectedClient.billingAddress,
        city: selectedClient.city,
        state: selectedClient.state,
      };

      localStorage.setItem("selectedStore", JSON.stringify(storeDetails)); // Save the full store details
      
    }

    console.log("Selected category:", selectedCategory);
    console.log("Selected Store:", selectedClient);
    navigate("/mutliple-color-select-custom");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredClients = clients.filter(
    (client) => !selectedLocation || client.city === selectedLocation
  );

  return (
    <>
      <Homepage />
      <div className="selected-category-container">
        <div className="selected-category-box">
          <div className="selectedStoreContainer">
            <select
              id="location-select"
              className="clientSelect"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              id="client-select"
              className="clientSelect"
              value={selectedStore}
              onChange={handleStoreChange}
            >
              <option value="">Select Store</option>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {`${client.billingAddress}, ${client.city}, ${client.state}`}
                  </option>
                ))
              ) : (
                <option disabled>No stores available for this location</option>
              )}
            </select>
          </div>

          <div className="block_category">
            {categories.length > 0 ? (
              categories.map((product) => (
                <label
                  key={product._id}
                  className={`category-option ${
                    selectedCategory === product.name ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={product.name}
                    checked={selectedCategory === product.name}
                    onChange={() =>
                      handleCategoryChange(product.name, product.discountPrice)
                    }
                  />
                  <div className="category-details">
                    <img
                      src={`/uploads/${product.images[0]}`}
                      alt={product.name}
                    />
                    <div className="category-info">
                      <span className="category-name">{product.name}</span>
                      <span className="category-price">
                        MRP: ₹{product.discountPrice}
                      </span>
                      <span className="category-offer-precentage">
                        Offer:{" "}
                        {(
                          ((product.mrp - product.discountPrice) /
                            product.mrp) *
                          100
                        ).toFixed(2)}
                        % off
                      </span>
                      <span className="category-mrp">MRP: ₹{product.mrp}</span>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>
          <button className="submit-buttonCategory" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
          <Footer/>
    </>
  );
};

export default SelectedCategoryToColor;
