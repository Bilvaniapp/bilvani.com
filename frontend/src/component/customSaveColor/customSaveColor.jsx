import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./customSaveColor.css";
import Homepage from "../homePage/homepage";
import { BASE_URL } from "../../helper/helper";
import Footer from "../footer/footer";
import { Modal, Button, Form } from "react-bootstrap";

const ColorComponent = () => {
  const [colorData, setColorData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [price, setPrice] = useState(0);
  const [lipstickType, setLipstickType] = useState("");
  const [fragrance, setFragrance] = useState("");
  const [glitterOption, setGlitterOption] = useState("");
  const [glitterType, setGlitterType] = useState("");
  const [isSummaryStep, setIsSummaryStep] = useState(false);
  const [products, setProducts] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch color data
    const fetchColorData = async () => {
      try {
        const permanentIdCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("permanentId="));
        if (!permanentIdCookie) {
          throw new Error("Unauthorized: PermanentId cookie not found");
        }

        const response = await axios.get(`${BASE_URL}/get-color-save`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setColorData(response.data.colorData);
      } catch (error) {
        console.log(error.message);
        if (error.message.includes("Unauthorized")) {
          navigate("/sign-in", { state: { fromColorComponent: true } });
        }
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/shade/get`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setProducts(response.data.data); 
      } catch (error) {
        console.log("Error fetching products:", error.message);
      }
    };

    fetchColorData();
    fetchProducts(); 
  }, [navigate]);

  const handlePlaceOrder = () => {
    setShowModal(true);
    setStep(1);
    setIsSummaryStep(false);
  };

  const handleSelectProduct = (e) => {
    const product = e.target.value;
    setSelectedProduct(product);

    const selected = products.find((p) => p.name === product);
    setPrice(selected?.discountPrice || 0);
  };

  const handleNextStep = () => {
    if (step === 1 && (selectedProduct === "Lipstick" || selectedProduct === "Lipstick Liquid")) {
      setStep(2);
    } else if (step === 1 && selectedProduct === "Nail Paint") {
      setStep(3);
    } else if (step === 2 || step === 3) {
      setIsSummaryStep(true);
    }
    
  };

  const handlePreviousStep = () => {
    setIsSummaryStep(false);
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(1);
    }
  };

  const handleConfirmOrder = () => {
    
    const mixedColorHex = colorData[0]?.mixedColorHex; 
  
   
    document.cookie = `mixedColorHex=${encodeURIComponent(mixedColorHex)}; path=/`;
  
    const orderData = {
      selectedCategory: selectedProduct,
      price,
      mixedColorHex, 
      ...(selectedProduct === "Lipstick" || selectedProduct === "Lipstick Liquid"
        ? { lipstickType, fragrance }
        : { glitterOption, glitterType }),
    };
  
   
    document.cookie = `orderData=${encodeURIComponent(
      JSON.stringify(orderData)
    )}; path=/`;
  
    navigate("/colororder");
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ background: "#F6D9D1" }}>
      <Homepage />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="color-component-container container">
        {colorData && colorData.length > 0 ? (
          <div>
            <h2>Saved Colors</h2>

            <div className="display-color-container">
              {colorData.map((color, index) => (
                <div className="container-color" key={index}>
                  <div className="color-item">
                    <div
                      className="mixed-color-box"
                      style={{ backgroundColor: color.mixedColorHex }}

                    ></div>
                    <h3>Color Shade: </h3>
                    <div className="color-list">
                      {color.selectedColors.map((selectedColor, index) => (
                        <div className="color-info" key={index}>
                          <div
                            className="color-box"
                            style={{ backgroundColor: selectedColor.hex }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn place-order-color"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-colors-message">
            <p>You have not saved any mixed colors yet.</p>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isSummaryStep
              ? "Confirm Your Order"
              : step === 1
              ? "Select Product"
              : step === 2
              ? "Select Type and Fragrance"
              : step === 3
              ? "Select Glitter Option"
              : "Confirm Order"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSummaryStep ? (
            <div>
              <h4>Order Summary:</h4>
              <p>Product: {selectedProduct}</p>
              <p>Price: ₹{price}</p>
              {selectedProduct === "Lipstick" ||
              selectedProduct === "Lipstick Liquid" ? (
                <>
                  <p>Type: {lipstickType}</p>
                  <p>Fragrance: {fragrance}</p>
                </>
              ) : (
                <>
                  <p>Glitter Option: {glitterOption}</p>
                  {glitterOption === "With Glitter" && (
                    <p>Glitter Type: {glitterType}</p>
                  )}
                </>
              )}
            </div>
          ) : step === 1 ? (
            <Form>
              <Form.Group>
                <Form.Label>Select a product:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProduct}
                  onChange={handleSelectProduct}
                >
                  <option value="">Select...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {selectedProduct && (
                <div className="price-info">
                  <Form.Group>
                    <Form.Label>Product Price:</Form.Label>
                    <p>Price: ₹{price}</p>
                  </Form.Group>
                </div>
              )}
            </Form>
          ) : step === 2 && selectedProduct !== "Nail Paint" ? (
            <Form>
              <Form.Group>
                <Form.Label>Select a type of lipstick:</Form.Label>
                <Form.Control
                  as="select"
                  value={lipstickType}
                  onChange={(e) => setLipstickType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Matte">Matte</option>
                  <option value="Glossy">Glossy</option>
                  <option value="Satin">Satin</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Select a fragrance:</Form.Label>
                <Form.Control
                  as="select"
                  value={fragrance}
                  onChange={(e) => setFragrance(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Rose">Rose</option>
                  <option value="Lavender">Lavender</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Strawberry">Strawberry</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="None">None</option>
                </Form.Control>
              </Form.Group>
            </Form>
          ) : step === 3 && selectedProduct === "Nail Paint" ? (
            <Form>
              <Form.Group>
                <Form.Label>Select glitter option:</Form.Label>
                <Form.Control
                  as="select"
                  value={glitterOption}
                  onChange={(e) => setGlitterOption(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="With Glitter">With Glitter</option>
                  <option value="Without Glitter">Without Glitter</option>
                </Form.Control>
              </Form.Group>
              {glitterOption === "With Glitter" && (
                <Form.Group>
                  <Form.Label>Select glitter type:</Form.Label>
                  <Form.Control
                    as="select"
                    value={glitterType}
                    onChange={(e) => setGlitterType(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Fine">Fine</option>
                    <option value="Chunky">Chunky</option>
                  </Form.Control>
                </Form.Group>
              )}
            </Form>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {isSummaryStep ? (
            <>
              <Button variant="secondary" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button variant="primary" onClick={handleConfirmOrder}>
                Confirm
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleNextStep}>
                Next
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default ColorComponent;
