import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BASE_URL } from "../../helper/helper";
import Homepage from "../homePage/homepage";
import "./shop.css";

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [priceFilterOptions, setPriceFilterOptions] = useState([]);
  const [selectedSortOrder, setSelectedSortOrder] = useState(""); // State for sorting
  const [selectedCategory, setSelectedCategory] = useState(""); // State for category filtering
  const [categories, setCategories] = useState([]); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/create-product/get/all/product`
        );
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initialize with all products

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(fetchedProducts.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map(
            (product) => product.discountedPrice
          );
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          const rangeStep = Math.ceil((maxPrice - minPrice) / 4); // Determine the step for ranges
          const newPriceFilterOptions = [];

          for (let i = minPrice; i < maxPrice; i += rangeStep) {
            const endRange = Math.min(i + rangeStep, maxPrice);
            newPriceFilterOptions.push({
              label: `₹${i} - ₹${endRange}`,
              value: `${i}-${endRange}`,
            });
          }

          setPriceFilterOptions(newPriceFilterOptions);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
    setFilteredProducts(updatedProducts);
  };

  const handlePriceFilterChange = (event) => {
    const priceRange = event.target.value;
    setSelectedPriceRange(priceRange);

    filterProducts(priceRange, selectedCategory, selectedSortOrder);
  };

  const handleSortOrderChange = (event) => {
    const sortOrder = event.target.value;
    setSelectedSortOrder(sortOrder);

    filterProducts(selectedPriceRange, selectedCategory, sortOrder);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    filterProducts(selectedPriceRange, category, selectedSortOrder);
  };

  const filterProducts = (priceRange, category, sortOrder) => {
    let filtered = products;

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) =>
          product.discountedPrice >= minPrice &&
          product.discountedPrice <= maxPrice
      );
    }

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sortOrder) {
      filtered = filtered.sort((a, b) => {
        if (sortOrder === "low-to-high") {
          return a.discountedPrice - b.discountedPrice;
        } else if (sortOrder === "high-to-low") {
          return b.discountedPrice - a.discountedPrice;
        }
        return 0;
      });
    }

    setFilteredProducts(filtered);
  };

  const handleBuyNowClick = (id) => {
    const permanentId = Cookies.get("permanentId");
    if (!permanentId) {
      navigate("/sign-in", {
        state: { fromProductDetail: true, productId: id },
      });
    } else {
      navigate(`/product-address-buy/${id}`);
    }
  };

  return (
    <div className="home-product">
      <Homepage cartCount={cartCount} /> <br />
      <br />
      <br />
      <div className="filter-option">
        <select
          id="price-filter"
          value={selectedPriceRange}
          onChange={handlePriceFilterChange}
        >
          <option value="">Filter Price</option>
          {priceFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

  
        <select
          id="sort-order"
          value={selectedSortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="">Sort</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>
  
     
      <div className="container-fluid">
        <div className="products-grid product-container-shop">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
              <Link
                to={`/product/${product.category}/${product.title}/${product._id}`}
              >
                <div className="product-image">
                  {product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className=""
                    />
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
                    <button className="btn cart_btn">Go to Cart</button>
                  </Link>
                ) : (
                  <button
                    className="btn cart_btn"
                    onClick={() =>
                      addToCart(product._id, product.quantity || 1)
                    }
                  >
                    Add Cart
                  </button>
                )}
                <button
                  className="btn cart_btn"
                  onClick={() => handleBuyNowClick(product._id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <br />
      </div>
    </div>
  );
};

export default ShopList;
