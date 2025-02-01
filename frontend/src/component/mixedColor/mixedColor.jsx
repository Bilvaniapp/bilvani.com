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
  const [selectedColorData, setSelectedColorData] = useState(null); // For storing clicked color data

  const [mixedHexCode, setMixedHexCode] = useState("#000000");
  const [showModal, setShowModal] = useState(false);
  const [lipstickType, setLipstickType] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState({});
  const [fragrance, setFragrance] = useState("");
  const [glitterOption, setGlitterOption] = useState("");
  const [glitterType, setGlitterType] = useState("");
  const [shadeColors, setShadeColors] = useState([]); // For storing colors fetched from backend
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchColorsByShade = async () => {
      const selectedShade = localStorage.getItem("selectedShade");
      if (!selectedShade) {
        setError("No shade selected in localStorage.");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/bilvani/shade/color`,
          {
            params: { shade: selectedShade },
          }
        );
        setShadeColors(response.data); // Update state with fetched colors
      } catch (err) {
        console.error("Error fetching colors:", err);
        setError("Failed to fetch colors. Please try again later.");
      }
    };

    fetchColorsByShade();
  }, []);

  const handlePlaceOrder = () => {
    const selectedCategory = localStorage.getItem("selectedCategory");
    if (
      selectedCategory === "Lipstick" ||
      selectedCategory === "Lipstick Liquid"
    ) {
      setShowModal(true);
    } else if (selectedCategory === "Nail Paint") {
      setShowModal(true);
    } else {
      saveOrder();
    }
  };

  const handleModalSubmit = () => {
    const selectedCategory = localStorage.getItem("selectedCategory");

    if (
      selectedCategory === "Nail Paint" &&
      glitterOption === "withGlitter" &&
      !glitterType
    ) {
      alert("Please select a glitter type.");
      return;
    }

    if (!lipstickType && selectedCategory !== "Nail Paint") {
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

    // Construct the order data object with the selected colors and other details
    const orderData = {
      selectedColors: selectedColorData, // Save the flattened colors array with hex, shade, intensity

      selectedCategory: localStorage.getItem("selectedCategory"), // Category from localStorage
      price: localStorage.getItem("Price"), // Price from localStorage
      lipstickType,
      fragrance,
      glitterOption,
      glitterType,
    };
    navigate("/colororder");
    // Set expiration date for cookies (48 hours from now)
    const expirationDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // Store the order data in the cookies with expiration date
    Cookies.set("orderData", JSON.stringify(orderData), {
      expires: expirationDate,
    });
  };

  const handleColorClick = (mixedColorHex, colors) => {
    // Combine mixedColorHex and colors into a single object
    const selectedData = {
      mixedColorHex,
      colors: colors.map(({ hex, shade, intensity }) => ({
        hex,
        shade,
        intensity,
      })),
    };
    handlePlaceOrder();
    setSelectedColorData(selectedData); // Store in state
  };

  return (
    <>
      <Homepage />
      <br />
      <div className=" _starting_color_1">
        <div className="mainBock-code">
          <div className="">
            <div>
              <div className="mix-color-btn-container"></div>

              {shadeColors.length > 0 && (
                <div className="colorContainer_sm">
                  <div className="colorContainerPresent">
                    {shadeColors.map((color, index) => {
                      const isNailPaint =
                        localStorage.getItem("selectedCategory") ===
                        "Nail Paint";

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            handleColorClick(color.mixedColorHex, color.colors)
                          }
                        >
                          {!isNailPaint && (
                            <>
                              {/* Lipstick Top */}
                              <div
                                style={{
                                  backgroundColor: color.mixedColorHex,
                                  width: "120px",
                                  height: "120px",
                                  borderRadius: "20px",
                                }}
                              ></div>
                            </>
                          )}

                          {isNailPaint && (
                            <div className="nailPolish">
                              {/* Cap of the Bottle */}
                              <div
                                style={{
                                  backgroundColor: "#333", // Dark color for the cap
                                  width: "30px",
                                  height: "40px",
                                  borderTopLeftRadius: "20px",
                                  borderTopRightRadius: "20px",
                                  margin: "0 auto",
                                }}
                              ></div>

                              {/* Neck of the Bottle */}
                              <div
                                style={{
                                  backgroundColor: "#ccc", // Gray color for the neck of the bottle
                                  width: "25px",
                                  height: "20px",
                                  margin: "0 auto",
                                }}
                              ></div>

                              {/* Body of the Bottle */}
                              <div
                                style={{
                                  backgroundColor: color.mixedColorHex, // The color of the nail polish
                                  width: "60px",
                                  height: "120px",
                                  borderRadius: "15px", // Soft rounded corners for a professional look
                                  margin: "0 auto",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add a subtle shadow for realism
                                  position: "relative", // For positioning the brand name inside the body
                                }}
                              >
                                {/* Bilvani Brand Name (Vertical) */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    writingMode: "vertical-rl",
                                    fontSize: "18px",

                                    color: "#fff",

                                    textShadow:
                                      "1px 1px 3px rgba(0, 0, 0, 0.5)",
                                  }}
                                >
                                  Bilvani
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                  <Form.Control
                    as="select"
                    value={lipstickType}
                    onChange={(e) => setLipstickType(e.target.value)}
                  >
                    <option value="">Select Lipstick Type</option>
                    <option value="Matte">Matte</option>
                    <option value="Creamy">Creamy</option>
                    <option value="Glossy">Glossy</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="fragrance">
                  <Form.Label>Select Fragrance</Form.Label>
                  <Form.Control
                    as="select"
                    value={fragrance}
                    onChange={(e) => setFragrance(e.target.value)}
                  >
                    <option value="">Select Fragrance</option>
                    <option value="Rose">Rose</option>
                    <option value="Lavender">Lavender</option>
                    <option value="Vanilla">Vanilla</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
            {localStorage.getItem("selectedCategory") === "Nail Paint" && (
              <>
                <Form.Group controlId="glitterOption">
                  <Form.Label>Select Glitter Option</Form.Label>
                  <Form.Control
                    as="select"
                    value={glitterOption}
                    onChange={(e) => setGlitterOption(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="withGlitter">With Glitter</option>
                    <option value="withoutGlitter">Without Glitter</option>
                  </Form.Control>
                </Form.Group>
                {glitterOption === "withGlitter" && (
                  <Form.Group controlId="glitterType">
                    <Form.Label>Select Glitter Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={glitterType}
                      onChange={(e) => setGlitterType(e.target.value)}
                    >
                      <option value="">Select Glitter Type</option>
                      <option value="Fine">Fine</option>
                      <option value="Chunky">Chunky</option>
                    </Form.Control>
                  </Form.Group>
                )}
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

      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Category:</strong> {confirmationDetails.selectedCategory}
          </p>
          {confirmationDetails.selectedCategory !== "Nail Paint" && (
            <>
              <p>
                <strong>Lipstick Type:</strong>{" "}
                {confirmationDetails.lipstickType}
              </p>
              <p>
                <strong>Fragrance:</strong> {confirmationDetails.fragrance}
              </p>
            </>
          )}
          {confirmationDetails.selectedCategory === "Nail Paint" && (
            <>
              <p>
                <strong>Glitter Option:</strong>{" "}
                {confirmationDetails.glitterOption}
              </p>
              {confirmationDetails.glitterOption === "withGlitter" && (
                <p>
                  <strong>Glitter Type:</strong>{" "}
                  {confirmationDetails.glitterType}
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Make Change
          </Button>
          <Button variant="primary" onClick={saveOrder}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MixedColor;
