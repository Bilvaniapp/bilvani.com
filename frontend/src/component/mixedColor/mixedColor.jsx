import { useEffect, useState } from "react";
import Homepage from "../homePage/homepage";
import "./mixedColor.css";
import { BASE_URL } from "../../helper/helper";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const MixedColor = () => {
  const navigate = useNavigate();
  const [selectedColorData, setSelectedColorData] = useState(null);
  const [mixedHexCode, setMixedHexCode] = useState("#000000");
  const [showModal, setShowModal] = useState(false);
  const [lipstickType, setLipstickType] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState({});
  const [fragrance, setFragrance] = useState("");
  const [glitterOption, setGlitterOption] = useState("");
  const [glitterType, setGlitterType] = useState("");
  const [shadeColors, setShadeColors] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    const fetchColorsByShade = async () => {
      const selectedShade = localStorage.getItem("selectedShade");
      if (!selectedShade) {
        setError("No shade selected in localStorage.");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/bilvani/shade/color`, {
          params: { shade: selectedShade },
        });
        setShadeColors(response.data);
      } catch (err) {
        console.error("Error fetching colors:", err);
        setError("Failed to fetch colors. Please try again later.");
      }
    };

    fetchColorsByShade();
  }, []);

  const handleColorClick = (mixedColorHex, colors, colorCode) => {
    const selectedData = {
      mixedColorHex,
      colors: colors.map(({ hex, shade, intensity }) => ({
        hex,
        shade,
        intensity,
      })),
      colorCode,
    };

    setSelectedColorData(selectedData);
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory === "Nail Paint" && glitterOption === "withGlitter" && !glitterType) {
      alert("Please select a glitter type.");
      return;
    }

    if (selectedCategory !== "Nail Paint" && (!lipstickType || !fragrance)) {
      alert("Please select both lipstick type and fragrance.");
      return;
    }

    setConfirmationDetails({
      lipstickType,
      fragrance,
      glitterOption,
      glitterType,
      selectedCategory,
    });

    setShowModal(false);
    setShowConfirmationModal(true);
  };

  const saveOrder = () => {
    if (!selectedColorData) {
      alert("No color data selected.");
      return;
    }

    const orderData = {
      selectedColors: selectedColorData,
      selectedCategory: localStorage.getItem("selectedCategory"),
      price: localStorage.getItem("Price"),
      lipstickType,
      fragrance,
      glitterOption,
      glitterType,
    };

    const expirationDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
    Cookies.set("orderData", JSON.stringify(orderData), { expires: expirationDate });

    navigate("/colororder");
  };

  const filteredColors = shadeColors.filter((color) =>
    color.colorCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Homepage />
      <br />
      <div className="_starting_color_1">
        <div className="mainBock-code">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by color code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="colorContainer_sm">
            {filteredColors.length > 0 ? (
              <div className="colorContainerPresent">
                {filteredColors.map((color, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleColorClick(color.mixedColorHex, color.colors, color.colorCode)}
                    >
                      <div
                        style={{
                          backgroundColor: color.mixedColorHex,
                          width: "120px",
                          height: "120px",
                          borderRadius: "20px",
                          marginBottom: "5px",
                        }}
                      ></div>
                      <p>Color Code: {color.colorCode}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No colors found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {localStorage.getItem("selectedCategory") !== "Nail Paint" && (
              <>
                <Form.Group controlId="lipstickType">
                  <Form.Label>Select Lipstick Type</Form.Label>
                  <Form.Control as="select" value={lipstickType} onChange={(e) => setLipstickType(e.target.value)}>
                    <option value="">Select Lipstick Type</option>
                    <option value="Matte">Matte</option>
                    <option value="Glossy">Glossy</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="fragrance">
                  <Form.Label>Select Fragrance</Form.Label>
                  <Form.Control as="select" value={fragrance} onChange={(e) => setFragrance(e.target.value)}>
                    <option value="">Select Fragrance</option>
                    <option value="Rose">Rose</option>
                    <option value="Strawberry">Strawberry</option>
                    <option value="Vanilla">Vanilla</option>
                    <option value="Bubble Gum">Bubble Gum</option>
                    <option value="Butter Scotch">Butter Scotch</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Category:</strong> {confirmationDetails.selectedCategory}</p>
          {confirmationDetails.selectedCategory !== "Nail Paint" && (
            <>
              <p><strong>Lipstick Type:</strong> {confirmationDetails.lipstickType}</p>
              <p><strong>Fragrance:</strong> {confirmationDetails.fragrance}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Make Change
          </Button>
          <Button variant="primary" onClick={() => { setShowConfirmationModal(false); saveOrder(); }}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MixedColor;
