import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const handleLinkClick = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <footer className="footer">
        <hr style={{ color: "red" }} />
        <div className="footer-container">
          
          <div className="footer-section">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <span onClick={() => handleLinkClick("/")}>Home</span>
              </li>
              <li>
                <span onClick={() => handleLinkClick("/Bilvani-About-us")}>
                  About Us
                </span>
              </li>
              <li>
              <span onClick={() => handleLinkClick("/bilvani-contact")}>
                  Contact Us
                </span>
              </li>

              <p onClick={() => handleLinkClick("/Supported-by")}>
            Supported By
            </p>

            </ul>

          </div>
          <div className="footer-section">
            <h2>Follow Us</h2>
            <div className="social-links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h2>Shop</h2>
            <p
              onClick={() =>
                handleLinkClick("/bilvani-return-and-refund-policy")
              }
            >
              Returns and Exchanges
            </p>

            <p onClick={() => handleLinkClick("/bilvani-terms-and-conditions")}>
              Terms and Conditions
            </p>
            <p onClick={() => handleLinkClick("/bilvani-shipping-policy")}>
              Shipping Policy
            </p>
            <p onClick={() => handleLinkClick("/bilvani-refund-policy")}>
              Refund Policy
            </p>

            

          </div>
        </div>
       
      </footer>
    </>
  );
};

export default Footer;
