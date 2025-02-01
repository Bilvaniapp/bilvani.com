import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { BASE_URL } from "../../helper/helper";
import "./homepage.css";

const Homepage = () => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navLineRef = useRef(null); // Make sure to use this ref in your JSX

  const handleUserIconClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  const handleResize = () => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/create-product/search-products`,
        {
          params: { title: query },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };

  const handleSearchIconClick = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const permanentId = Cookies.get("permanentId");
      if (permanentId) {
        setIsLoggedIn(true);
      }
    };

    const fetchCartCount = async () => {
      const permanentId = Cookies.get("permanentId");
      if (!permanentId) {
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/cart-get`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const items = response.data;
        setCartCount(items.length);
      } catch (error) {}
    };

    checkLoginStatus();
    fetchCartCount();

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("permanentId");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (navLineRef.current) {
      const activeRoute = navLineRef.current.querySelector(".active");
      if (activeRoute) {
        activeRoute.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [location.pathname]);

  return (
    <div className="fixed-container">
      <div className="fixed-navbar-top">
        <div className="navbarsss">
          <div className="social-work">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="social-color" />
            </a>
            <a
              href="https://x.com/askbilvani"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/askbilvani/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/bilvani-ask-your-shade-90869b348/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>

          <div className="logo">
            <Link to="/">
              <img src="/Logo.png" alt="Logo" />
            </Link>
          </div>

          {searchVisible && (
            <div className={`containerForm }`}>
              <nav>
                <div className="container-fluid">
                  <form
                    className="d-flex form-mobile w-100"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="search-container">
                      <input
                        className=" form-control-search form-control"
                        type="search"
                        placeholder="Search Product here......!"
                        aria-label="Search"
                        style={{ flexGrow: 1 }}
                        onChange={handleSearch}
                      />
                    </div>
                  </form>

                  {searchResults.length > 0 && (
                    <ul className="search-results">
                      {searchResults.map((product) => (
                        <li key={product._id}>
                          <Link
                            to={`/product/${product.category}/${product.title}/${product._id}`}
                          >
                            {product.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <ul className="search-results">
                      <li>No Product Found</li>
                    </ul>
                  )}
                </div>
              </nav>
            </div>
          )}

          <div className="icon">
            <div className="search-icon">
              <button
                className="btn btn_search_icon"
                onClick={handleSearchIconClick}
              >
                <img
                  src="/search.png"
                  alt="Search Icon"
                  className="img-fluid"
                  width="20px"
                />
              </button>
            </div>
            <div
              className="icon-div"
              onClick={handleUserIconClick}
              ref={dropdownRef}
            >
              <img
                src="/user.png"
                alt="User Icon"
                className="img-fluid"
                width="30px"
                height="10px"
              />
              {isLoggedIn ? (
                <div className="my-account-dropdown">
                  <span className="my-account">
                    My Account{" "}
                    <span
                      className={`arrow ${dropdownVisible ? "up" : "down"}`}
                    ></span>
                  </span>
                  <div
                    className={`dropdown-content ${
                      dropdownVisible ? "visible" : ""
                    }`}
                  >
                    <Link to="/view-profile/exploreProfile-mode=true&refrence==Bilvani">
                      Profile
                    </Link>
                    <Link to="/view-order/link==home_link&refrence==Bilvani">
                      My Order
                    </Link>
                    <Link onClick={handleLogout}>Logout</Link>
                  </div>
                </div>
              ) : (
                <div className="my-account-dropdown">
                  <span className="my-account">
                    Registration{" "}
                    <span
                      className={`arrow ${dropdownVisible ? "up" : "down"}`}
                    ></span>
                  </span>
                  <div
                    className={`dropdown-content ${
                      dropdownVisible ? "visible" : ""
                    }`}
                    ref={dropdownRef}
                  >
                    <Link to="/sign-in">Login</Link>
                    <Link to="/sign-up">Register</Link>
                  </div>
                </div>
              )}
            </div>
            <div className="cart-icon">
              <Link to="/viewcart/exploreMode==true&refrence=Bilvani">
                <img
                  src="/shopping-bag.png"
                  alt="Cart Icon"
                  className="img-fluid"
                  width="30px"
                />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <div className="nav-line" ref={navLineRef}>
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/select-category"
            className={isActive("/select-category") ? "active" : ""}
          >
            Customized Shade
          </Link>
         
          {/* <Link
            //to="/shopList"
            //className={isActive("/shopList") ? "active" : ""}
          >
            
          </Link> */}
          
          <Link
            to="/Bilvani-About-Us"
            className={isActive("/Bilvani-About-Us") ? "active" : ""}
          >
            About
          </Link>
          <Link to="/bilvani-contact" className={isActive("/bilvani-contact") ? "active" : ""}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
