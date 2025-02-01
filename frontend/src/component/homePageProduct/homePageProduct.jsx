import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BASE_URL } from "../../helper/helper";
import Homepage from "../homePage/homepage";
import "./homePageProduct.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(-1);
  const navigate = useNavigate();

  const banners = [ "/banner_1.jpeg", "/banner_2.svg","/banner_3.svg",];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/create-product/get/all/product`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval); // Clean up interval on component unmount
  }, [banners.length, currentSlide]);

  const addToCart = async (productId, quantity) => {
    try {
      const permanentId = Cookies.get("permanentId");
      if (!permanentId) {
        alert("Please sign in or sign up first.");
        return;
      }

      const response = await axios.post(`${BASE_URL}/add-cart`, {
        permanentId,
        productId,
        quantity,
      });

      if (response.status === 201) {
        console.log("Item added to cart successfully:", response.data);
        setCartCount(cartCount + 1);
        navigate("/viewcart/exploreMode==true&refrence=Bilvani");
      } else if (response.status === 200) {
        console.log("Item is already in the cart");
        navigate("/viewcart/exploreMode==true&refrence=Bilvani");
      } else {
        console.error("Error adding item to cart:", response.data);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const goToNextSlide = () => {
    setPrevSlide(currentSlide);
    setCurrentSlide((currentSlide + 1) % banners.length);
  };

  const goToPrevSlide = () => {
    setPrevSlide(currentSlide);
    setCurrentSlide((currentSlide - 1 + banners.length) % banners.length);
  };

  return (
    <div className="home-product">
      <Homepage cartCount={cartCount} /> <br />

      <div className="bilavani_banner">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`banner-image ${currentSlide === index ? "active" : prevSlide === index ? "prev" : ""
              }`}
            onClick={() => window.location.href = "/select-category"} // Redirect on click
          />
        ))}
        <button className="prev-btn" onClick={goToPrevSlide}>
          &lt;
        </button>
        <button className="next-btn" onClick={goToNextSlide}>
          &gt;
        </button>
      </div>

      <br />


      {/* <div className="container-fluid">
        <h2>Popular Product</h2>
        <br />
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <Link
                to={`/product/${product.category}/${product.title}/${product._id}`}
              >
                <div className="product-image">
                  {product.images.length > 0 && (
                    <img src={product.images[0]} alt={product.title} className="" />
                  )}
                </div>
                <div className="product-details">
                  <h5>{product.title}</h5>
                  <p className="product-price">
                    <span>₹</span> {product.discountedPrice}{" "}
                    <span className="spanss">₹ {product.actualPrice}</span>

                  </p>
                </div>
              </Link>
              <div className="quantity-control">
                <button
                  className="btn"
                  onClick={() =>
                    handleQuantityChange(
                      product._id,
                      Math.max((product.quantity || 1) - 1, 1)
                    )
                  }
                >
                  -
                </button>
                <span>{product.quantity || 1}</span>
                <button
                  className="btn"
                  onClick={() =>
                    handleQuantityChange(
                      product._id,
                      (product.quantity || 1) + 1
                    )
                  }
                >
                  +
                </button>
              </div>
              <div className="add_to_cart_btn">
                {product.inCart ? (
                  <Link to="/demo">
                    <button className="btn btn_actual">Go to Cart</button>
                  </Link>
                ) : (
                  <button
                    className="btn btn_actual"
                    onClick={() =>
                      addToCart(product._id, product.quantity || 1)
                    }
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <br />
      </div>*/}

      


    </div>
  );
};

export default ProductsList;
