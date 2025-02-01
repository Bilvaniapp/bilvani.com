import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../helper/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const initialState = {
    email: "",
    name: "",
    password: "",
    phone: "+91",
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [sendOtp, setSendOtp] = useState("");
  const [verifyEmailError, setVerifyEmailError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state for the main form submission
  const [loadingOTP, setLoadingOTP] = useState(false);  // Loading state for OTP verification

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
    setVerifyEmailError("");
    setSignupError("");

    if (!showOTPField) {
      if (!formData.name.trim()) {
        setNameError("Name cannot be empty");
        return;
      }
      if (!formData.email.trim()) {
        setEmailError("Email cannot be empty");
        return;
      }

      const gmailRegex = /^([\w]*[\w.]*(?!\.)@gmail.com)/;
      if (!gmailRegex.test(formData.email.trim())) {
        setEmailError("Please enter a valid Gmail address");
        return;
      }

      if (!formData.password.trim()) {
        setPasswordError("Password cannot be empty");
        return;
      } else if (formData.password.length < 6) {
        setPasswordError("Must be at least 6 characters long");
        return;
      }

      if (!formData.phone.trim()) {
        setPhoneError("Phone cannot be empty");
        return;
      }

      const indianPhoneRegex = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/;
      if (!indianPhoneRegex.test(formData.phone.trim())) {
        setPhoneError("Please enter a valid Indian phone number");
        return;
      }

      setLoading(true);  // Set loading to true when form is submitted

      try {
        const response = await axios.post(`${BASE_URL}/sign-up`, { email: formData.email, phone: formData.phone });
        console.log(response.data);
        setSendOtp('Your OTP has been successfully sent.');
        setShowOTPField(true);
      } catch (error) {
        setSignupError("Signup Error :  " + error.response.data.message);
      } finally {
        setLoading(false);  // Set loading to false when the request is complete
      }
    } else {
      // If OTP field is shown, handle only email verification
      setLoadingOTP(true);  // Set loadingOTP to true when OTP verification starts

      try {
        const response = await axios.post(`${BASE_URL}/verify-email`, {
          email: formData.email,
          otp: otp,
          name: formData.name,
          password: formData.password,
          phone: formData.phone
        }, { withCredentials: true });
        console.log(response.data);

        document.cookie = `permanentId=${response.data.permanentId}; path=/`;

        navigate('/');
      } catch (error) {
        setVerifyEmailError("Email verification failed: " + error.response.data.message);
      } finally {
        setLoadingOTP(false);  // Set loadingOTP to false when the request is complete
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNameFocus = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/resend-otp`, { email: formData.email });
      setSendOtp("OTP resent successfully");
    } catch (error) {
      console.error("Error resending OTP:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (verifyEmailError) {
      const timer = setTimeout(() => {
        setVerifyEmailError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verifyEmailError]);

  useEffect(() => {
    if (signupError) {
      const timer = setTimeout(() => {
        setSignupError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [signupError]);

  useEffect(() => {
    if (sendOtp) {
      const timer = setTimeout(() => {
        setSendOtp('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sendOtp]);

  return (
    <>
      {sendOtp && <p className="massage-show alert alert-success">{sendOtp}</p>}
      {verifyEmailError && <p className="massage-show alert alert-danger">{verifyEmailError}</p>}
      {signupError && <p className="massage-show alert alert-danger">{signupError}</p>}
      <div className="fixed-container">
        <div className="fixed-navbar-top">
          <div className="navbarsss">
            <div className="logo">
              <img src="/Logo.png" alt="Logo" />
            </div>

            <div className="containerForm">
              <nav className="">
                <div className="container-fluid ">
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
            <Link to='/select-category' >Customized Shade</Link>
        
            <Link to='/Bilvani-About-Us'>About</Link>
            <Link to ="/bilvani-contact">Contact</Link>
          </div>
        </div>
      </div>

      <br />
      <div className="bodyss">
        <div className="forImage">
          <div className="image">
            <img src="/signup.jpg" alt="Loading Image" />
          </div>
          <div className="form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
              <h2 className="signup_text">Sign Up</h2>
              <div>
                {!showOTPField && (
                  <>
                    <div className="input-groups">
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={handleNameFocus}
                        required
                      />
                      {nameError && <p className="error-message">{nameError}</p>}
                    </div>
                    <div className="input-groups">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={handleNameFocus}
                        required
                      />
                      {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div className="input-groups">
                      <label htmlFor="password">Password:</label>
                      <div className="password-input">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={handleNameFocus}
                          required
                        />
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          onClick={togglePasswordVisibility}
                          className="password-toggle-icon"
                        />
                      </div>
                      {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                    <div className="input-groups">
                      <label htmlFor="phone">Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter your Number"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={handleNameFocus}
                        required
                      />
                      {phoneError && <p className="error-message">{phoneError}</p>}
                    </div>
                  </>
                )}
                {showOTPField && (
                  <div>
                    <div className="input-groups">
                      <label htmlFor="otp">Enter OTP:</label>
                      <input
                        type="text"
                        name="otp"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        required
                      />
                      <div className="mainResendContainer">
                        <h6 className="resendotp btn" onClick={handleResendOTP}>Resend Otp</h6>
                      </div>
                    </div>
                  </div>
                )}
                <div className="input-groups">
                  <button className="input-btn" type="submit" disabled={loading || loadingOTP}>
                    {loading || loadingOTP ? "Processing..." : showOTPField ? "Verify OTP" : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
