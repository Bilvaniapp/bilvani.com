import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import "./admin-header.css";

function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(false); // State for Master section
  const [activeMasterSub, setActiveMasterSub] = useState(""); // Track active Master subfield
  const location = useLocation();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // Track if user is Super Admin

  useEffect(() => {
    const screenWidth = window.innerWidth;

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setIsSuperAdmin(decodedToken.role === "Super Admin");
      } catch (error) {
        console.error("Error decoding token", error);
        setIsSuperAdmin(false);
      }
    } else {
      setIsSuperAdmin(false);
    }

    if (screenWidth > 768) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    // Update state based on the current path
    if (
      location.pathname === "/admin-bilvani-add-category" ||
      location.pathname.startsWith("/admin-bilvani-sub-category")
    ) {
      setShowCategories(true);
      setIsOpen(true);
    } else {
      setShowCategories(false);
    }

    if (
      location.pathname === "/admin-bilvani-enter-product" ||
      location.pathname.startsWith("/admin-bilvani-all-product")
    ) {
      setShowProducts(true);
      setIsOpen(true);
    } else {
      setShowProducts(false);
    }
  }, [location.pathname]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    setShowCategories(false);
    setShowProducts(false);
  };

  const toggleCategories = () => {
    setIsOpen(true);
    setShowCategories(!showCategories);
  };

  const toggleProducts = () => {
    setIsOpen(true);
    setShowProducts(!showProducts);
  };

  const toggleClientOptions = () => {
    setIsOpen(true);
    setIsClientOpen(!isClientOpen);
  };

  const toggleSupplierOptions = () => {
    setIsSupplierOpen(!isSupplierOpen);
  };

  const toggleMasterOptions = () => {
    setIsMasterOpen(!isMasterOpen);
    setActiveMasterSub(""); // Collapse any open subcategory
  };

  const toggleMasterSub = (subfield) => {
    setActiveMasterSub(activeMasterSub === subfield ? "" : subfield);
  };

  return (
    <div className="app">
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="toggle-btn" onClick={toggleNavbar}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <nav className="adminnavbar">
          <ul>
            <li
              onClick={() => (window.location.href = "/admin-dashboard")}
              className="linkCss"
            >
              <i className="fa-solid fa-house-user"></i>
              {isOpen && " Dashboard"}
            </li>

            {/* Conditionally render Category section for Super Admin */}
            {isSuperAdmin && (
              <li className="category-toggle" onClick={toggleCategories}>
                <i className="fa-solid fa-grid-2"></i>
                {isOpen && " Category"}
              </li>
            )}
            {showCategories && isSuperAdmin && (
              <ul>
                <ul className="subcategories">
                  <Link
                    to={"/admin-bilvani-add-category"}
                    className={`subLink ${
                      location.pathname === "/admin-bilvani-add-category"
                        ? "active"
                        : ""
                    }`}
                  >
                    Add Category
                  </Link>
                  <Link
                    to={"/admin-bilvani-sub-category"}
                    className={`subLink ${
                      location.pathname === "/admin-bilvani-sub-category"
                        ? "active"
                        : ""
                    }`}
                  >
                    Sub Category
                  </Link>
                </ul>
              </ul>
            )}

            {/* Conditionally render Product section */}
            {isSuperAdmin && ( 
              <li className="product-toggle" onClick={toggleProducts}>
                <i className="fa-solid fa-box"></i>
                {isOpen && " Website"}
              </li>
            )}
            {showProducts && isSuperAdmin && (
              <ul>
                <ul className="subcategories">
                  <Link
                    to={"/admin-bilvani-enter-product"}
                    className={`subLink ${
                      location.pathname === "/admin-bilvani-enter-product"
                        ? "active"
                        : ""
                    }`}
                  >
                    Enter Product
                  </Link>
                  <Link
                    to={"/admin-bilvani-all-product"}
                    className={`subLink ${
                      location.pathname === "/admin-bilvani-all-product"
                        ? "active"
                        : ""
                    }`}
                  >
                    All Product
                  </Link>
                </ul>
              </ul>
            )}

            {/* Client Section - Show only to Super Admin */}
            {isSuperAdmin && (
              <li className="product-toggle" onClick={toggleClientOptions}>
                <i className="fas fa-envelope"></i>
                {isOpen && " Client"}

                {isClientOpen && (
                  <ul className="subcategories">
                    <Link
                      to={"/new-client"}
                      className={`subLink ${
                        location.pathname === "/new-client" ? "active" : ""
                      }`}
                    >
                      Add Client
                    </Link>

                    <Link
                      to={"/manage-client"}
                      className={`subLink ${
                        location.pathname === "/manage-client" ? "active" : ""
                      }`}
                    >
                      Manage Client
                    </Link>
                  </ul>
                )}
              </li>
            )}

            <li className="product-toggle" onClick={toggleSupplierOptions}>
              <i className="fas fa-truck"></i>
              {isOpen && " Supplier"}
              {isSupplierOpen && (
                <ul className="subcategories">
                  <Link
                    to={"/new-supplier"}
                    className={`subLink ${
                      location.pathname === "/new-supplier" ? "active" : ""
                    }`}
                  >
                    Add Supplier
                  </Link>

                  <Link
                    to={"/manage-supplier"}
                    className={`subLink ${
                      location.pathname === "/manage-supplier" ? "active" : ""
                    }`}
                  >
                    Manage
                  </Link>
                </ul>
              )}
            </li>

            {/* Master Section */}
            <li>
              <div className="linkCss" onClick={toggleMasterOptions}>
                <i className="fas fa-folder"></i>
                {isOpen && " Master"}
              </div>
              {isMasterOpen && (
                <ul className="">
                  {/* Purchase Section */}

                  <div className="masterBlock">
                    <div
                      to={"#"}
                      className="linkCss"
                      onClick={() => toggleMasterSub("Purchase")}
                    >
                      {isOpen && " Purchase"}
                    </div>
                    {activeMasterSub === "Purchase" && (
                      <ul className="subcategories">
                        <Link
                          to={"/admin-bilvani-purchase"}
                          className={`subLink ${
                            location.pathname === "/admin-bilvani-purchase"
                              ? "active"
                              : ""
                          }`}
                        >
                          Add
                        </Link>
                        <hr />
                        <Link
                          to={"/admin-bilvani-purchase-manage"}
                          className={`subLink ${
                            location.pathname ===
                            "/admin-bilvani-purchase-manage"
                              ? "active"
                              : ""
                          }`}
                        >
                          Manage
                        </Link>
                      </ul>
                    )}
                  </div>

                  {/* Expense Section */}

                  <div className="masterBlock">
                    <div
                      to={"#"}
                      className="linkCss"
                      onClick={() => toggleMasterSub("Expense")}
                    >
                      {isOpen && " Expense"}
                    </div>

                    {activeMasterSub === "Expense" && (
                      <ul className="subcategories">
                        <Link
                          to={"/admin-bilvani-expense"}
                          className={`subLink ${
                            location.pathname === "/admin-bilvani-expense"
                              ? "active"
                              : ""
                          }`}
                        >
                          Add
                        </Link>
                        <hr />
                        <Link
                          to={"/admin-bilvani-expense-manage"}
                          className={`subLink ${
                            location.pathname ===
                            "/admin-bilvani-expense-manage"
                              ? "active"
                              : ""
                          }`}
                        >
                          Manage
                        </Link>
                      </ul>
                    )}
                  </div>

                  {/* Payment In Section */}

                  <div className="masterBlock">
                    <div
                      to={"#"}
                      className="linkCss"
                      onClick={() => toggleMasterSub("PaymentIn")}
                    >
                      {isOpen && " Payment In"}
                    </div>

                    {activeMasterSub === "PaymentIn" && (
                      <div className="subcategories">
                        <>
                          <Link
                            to={"/admin-bilvani-paymentIn"}
                            className={`subLink ${
                              location.pathname === "/admin-bilvani-paymentIn"
                                ? "active"
                                : ""
                            }`}
                          >
                            Add In
                          </Link>
                        </>
                        <hr />
                        <>
                          <Link
                            to={"/admin-bilvani-paymentIn-manage"}
                            className={`subLink ${
                              location.pathname ===
                              "/admin-bilvani-paymentIn-manage"
                                ? "active"
                                : ""
                            }`}
                          >
                            Manage In
                          </Link>
                        </>
                      </div>
                    )}
                  </div>

                  {/* Payment Out Section */}

                  <div className="masterBlock">
                    <div
                      to={"#"}
                      className="linkCss"
                      onClick={() => toggleMasterSub("PaymentOut")}
                    >
                      {isOpen && " Payment Out"}
                    </div>
                    {activeMasterSub === "PaymentOut" && (
                      <ul className="subcategories">
                        <>
                          <Link
                            to={"/admin-bilvani-paymentOut"}
                            className={`subLink ${
                              location.pathname === "/admin-bilvani-paymentOut"
                                ? "active"
                                : ""
                            }`}
                          >
                            Add Out
                          </Link>
                        </>
                        <hr />
                        <>
                          <Link
                            to={"/admin-bilvani-paymentOut-manage"}
                            className={`subLink ${
                              location.pathname ===
                              "/admin-bilvani-paymentOut-manage"
                                ? "active"
                                : ""
                            }`}
                          >
                            Manage Out
                          </Link>
                        </>
                      </ul>
                    )}
                  </div>

                  {/* Invoice */}

                  <div className="masterBlock">
                    <div
                      to={"#"}
                      className="linkCss"
                      onClick={() => toggleMasterSub("Invoice")}
                    >
                      {isOpen && " Invoice"}
                    </div>
                    {activeMasterSub === "Invoice" && (
                      <ul className="subcategories">
                        <>
                          <Link
                            to={"/admin/bilvani/new/invoice"}
                            className={`subLink ${
                              location.pathname === "/admin/bilvani/new/invoice"
                                ? "active"
                                : ""
                            }`}
                          >
                            New Invoice
                          </Link>
                        </>
                        <hr />
                        <>
                          <Link
                            to={"/admin/bilvani/manage/invoice"}
                            className={`subLink ${
                              location.pathname ===
                              "/admin/bilvani/manage/invoice"
                                ? "active"
                                : ""
                            }`}
                          >
                            Manage
                          </Link>
                        </>
                      </ul>
                    )}
                  </div>
                </ul>
              )}
            </li>

            {/* Excel Shade - Show only to Super Admin */}
            {isSuperAdmin && (
              <li>
                <Link
                  to={"/admin/bilvani/upload/shade"}
                  className="navbarNormal"
                >
                  <i className="fas fa-cogs"></i>
                  {isOpen && " Excel Shade"}
                </Link>
              </li>
            )}

            {/* Category Shade - Show only to Super Admin */}
            {isSuperAdmin && (
              <li>
                <Link
                  to={"/admin/bilvani/category/Shade"}
                  className="navbarNormal"
                >
                  <i className="fas fa-cogs"></i>
                  {isOpen && "Category Shade"}
                </Link>
              </li>
            )}

            {/* Order List - Show only to Super Admin */}
            {isSuperAdmin && (
              <li>
                <Link to={"/admin-bilvani-order"} className="navbarNormal">
                  <i className="fas fa-cogs"></i>
                  {isOpen && " Order List"}
                </Link>
              </li>
            )}

            {/* Contact - Show only to Super Admin */}
            {isSuperAdmin && (
              <li>
                <Link to={"/admin/bilvani/contact"} className="linkCss">
                  <i className="fas fa-envelope"></i>
                  {isOpen && " Contact"}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default AdminHeader;
