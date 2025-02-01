import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../helper/helper";
import "./signin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignInForm = () => {
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
  const [loading, setLoading] = useState(false); // Added loading state for general use
  const [sendingOtp, setSendingOtp] = useState(false); // Added loading state for OTP sending
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      if (isOtpSent) {
        await handleResetPassword(e);
      } else if (isForgotPassword) {
        await handleForgotPassword(e);
      } else {
        const response = await axios.post(`${BASE_URL}/sign-in`, {
          email,
          password,
        }, { withCredentials: true });
        document.cookie = `permanentId=${response.data.permanentId}; path=/`;

        if (location.state?.fromProductDetail) {
          navigate(`/product-address-buy/${location.state.productId}`);
        } else if (location.state?.fromColorComponent) {
          navigate(`/save-custom-colors`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSendingOtp(true); // Set sendingOtp to true when sending OTP

    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });
      setForgotPasswordMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setErrorMessage(error.response.data.message || "Error sending OTP.");
    } finally {
      setSendingOtp(false); // Set sendingOtp to false when the request is complete
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setForgotPasswordMessage(response.data.message);
      setIsOtpSent(false);
      setIsForgotPassword(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      setErrorMessage(error.response.data.message || "Error resetting password.");
    }
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="fixed-container">
        <div className="fixed-navbar-top">
          <div className="navbarsss">
            <div className="logo">
              <img src="/Logo.png" alt="Logo loading" />
            </div>

            <div className="containerForm">
              <nav className="">
                <div className="container-fluid">
                  <form
                    className="d-flex form w-100"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                  </form>
                </div>
              </nav>

              <div className="icon">
                <div>
                  <div className="icon-div"></div>
                </div>
               
              </div>
            </div>
          </div>

          <div className="nav-line">
            <Link to="/">Home</Link>
            <Link to="/select-category">Customized Shade</Link>
          
            <Link to="/Bilvani-About-Us">About</Link>
            <Link to ="/bilvani-contact" >Contact</Link>
          </div>
        </div>
      </div>

      <br /><br /><br />

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
            <form
              className="signin-form"
              onSubmit={handleSubmit}
            >
              <h2 className="signin_text">
                {isForgotPassword
                  ? "Forgot Password"
                  : isOtpSent
                  ? "Verify OTP"
                  : "Sign In"}
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
                    <i className="fa fa-lock"></i>
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
                  <i className="fa fa-user"></i>
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
                    <i className="fa fa-user"></i>
                  </div>
                  <div className="input-group password-input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <i className="fa fa-lock"></i>
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

              {!isForgotPassword && (
                <div>
                  <p className="alternative">Or </p>
                  <p className="alternative">
                    Not have an Account: <span> <Link to='/sign-up'>Sign-up</Link> </span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
