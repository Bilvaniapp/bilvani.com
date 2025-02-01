import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../../helper/helper";
import "./admin-login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AdminSignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isOtpSent) {
        await handleResetPassword(e);
      } else if (isForgotPassword) {
        await handleForgotPassword(e);
      } else {
        const response = await axios.post(
          `${BASE_URL}/api/login/admin`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        // Store token and category
        document.cookie = `token=${response.data.token}; path=/`;
        document.cookie = `storeAddress=${response.data.storeAddress}; path=/`;
        localStorage.setItem("Admin Info", response.data.category);

        // Redirect based on category
        navigate('/admin-dashboard');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSendingOtp(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/admin/forgot/password`, { email });
      setForgotPasswordMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/reset/password`, {
        email,
        otp,
        newPassword,
      });
      setForgotPasswordMessage(response.data.message);
      setIsOtpSent(false);
      setIsForgotPassword(false);
      setOtp("");
      setNewPassword("");

      // Refresh the page after successful password reset
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Optional delay to allow users to see the success message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (verifyEmail) {
      const timer = setTimeout(() => {
        setVerifyEmail("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verifyEmail]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <>
      <div className="fixed-container">
        <div className="fixed-navbar-top">
          <div className="navbarsss">
            <div className="logo">
              <img src="/Logo.png" alt="Logo" />
            </div>
            <div className="containerForm">
              <div className="icon">
                <div>
                  <div className="icon-div"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-line">
            <Link to="/">Home</Link>
            <Link to="/select-category">Customized Own Color</Link>
            <Link to="/Bilvani-About-Us">About</Link>
            <Link>Contact</Link>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />

      {errorMessage && (
        <p className="massage-show alert alert-danger">{errorMessage}</p>
      )}
      {verifyEmail && (
        <p className="massage-show alert alert-success">{verifyEmail}</p>
      )}
      {forgotPasswordMessage && (
        <p className="massage-show alert alert-success">{forgotPasswordMessage}</p>
      )}
      <div className="bodyss">
        <div className="forImage">
          <div className="image">
            <img src="/signin.jpg" alt="loading Image" />
          </div>
          <div className="form-container">
            <form className="signin-form" onSubmit={handleSubmit}>
              <h2 className="signin_text">
                {isForgotPassword
                  ? "Forgot Password"
                  : isOtpSent
                  ? "Verify OTP"
                  : "Welcome to Admin Login"}
              </h2>
              {isOtpSent ? (
                <>
                  <div className="input-group">
                    <label htmlFor="otp">Enter OTP:</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group password-input-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="password-toggle-icon-signin"
                    >
                      <FontAwesomeIcon
                        icon={passwordVisible ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>
                </>
              ) : isForgotPassword ? (
                <div className="input-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="password-toggle-icon-signin"
                    >
                      <FontAwesomeIcon
                        icon={passwordVisible ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>
                </>
              )}

              <div className="mainResendContainer">
                {!isForgotPassword && (
                  <h6 className="resendotp btn" onClick={() => setIsForgotPassword(true)}>
                    Forget Password
                  </h6>
                )}
              </div>
              <div className="input-group">
                <button type="submit" disabled={sendingOtp || loading}>
                  {sendingOtp
                    ? "Sending OTP..."
                    : loading
                    ? "Processing..."
                    : isOtpSent
                    ? "Verify"
                    : isForgotPassword
                    ? "Send OTP"
                    : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignInForm;
