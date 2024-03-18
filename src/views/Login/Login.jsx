import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import "./Login.css";
import Cookies from "universal-cookie";
import registerPage2_img from "../../assets/registerPage2_img.png";
import loginPage_img from "../../assets/loginPage_img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/slices/auth.js";
// import { useDispatch } from "react-redux";
// import { setAuth } from "../../store/slices/auth.js";
const cookies = new Cookies();

const Login = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.authReducer);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);

  const [ login, setLogin ] = useState(false);

  const [ usernameError, setUsernameError ] = useState("");
  const [ passwordError, setPasswordError ] = useState("");
  const [ globalError, setGlobalError ] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notifyError = (errMsg, field) => {
    if (field === "username") {
      setUsernameError(errMsg);
    } else if (field === "password") {
      setPasswordError(errMsg);
    } else if (field.length === 0) {
      setGlobalError("An error occurred, try again");
    }
  };

  const handleSubmit = async () => {
    setGlobalError("");
    try {
      if (!username || !password) {
        if (!username) {
          notifyError("*Field is required", "username");
        }
        if (!password) {
          notifyError("*Field is required", "password");
        }
        return;
      }
      const data = {
        username,
        password,
      };

      setLogin(true);

      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLogin(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message:
            errorData.message || "Something bad happened. Please try again",
          field: errorData.field || "",
        };
      }
      const responseData = await response.json();

      // console.log('Overall Data:', responseData);

      cookies.set("TOKEN", responseData.token, {
        path: "/",
      });
      cookies.set("USERNAME", responseData.username, {
        path: "/",
      });
      // navigate('/dashboard');
      dispatch(
        setAuth({
          isAuthenticated: true,
        }),
      );
      navigate("/UserProfiles");
    } catch (error) {
      // console.error('Error:', error);
      notifyError(error.message || "An error occurred", error.field || "");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {login ? (
        <div className="loading-div">
          <div className="loading">Loading...</div>
        </div>
      ) : (
        <div className="body">
          <div className="right-container">
            <div
              className="right-container__box"
              style={{
                // width: '300px',
                height: "400.83",
                left: "249px",
                position: "absolute",
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <div className="right-container-box">
                <h2 className="right-container__h2">Welcome back</h2>
                <p className="right-container__p">
                  Enter your credentials to access your account
                </p>
              </div>
              {globalError && (
                <span className="error-message">{globalError}</span>
              )}
              {/* <form onSubmit={handleSubmit}> */}
              <div
                className="input-container"
                style={{
                  color: "black",
                  fontSize: 18,
                  fontFamily: "Roboto",
                  fontWeight: "500",
                  wordWrap: "break-word",
                  marginTop: "10px",
                }}
              >
                <label htmlFor="username" className="right-container__label">
                  Username
                </label>
                <input
                  type="text"
                  className="right-container__input1"
                  name="username"
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => {
                    const inputValue = e.target.value.toLowerCase(); // Convert input to lowercase
                    setUsername(inputValue);
                    setUsernameError("");
                  }}
                  onKeyDown={handleKeyDown}
                />
                {usernameError && (
                  <span className="error-message">{usernameError}</span>
                )}

                <label htmlFor="password" className="right-container__label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="right-container__input1"
                    name="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {/* Text representation of eye icon */}
                  <div
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </div>
                </div>
                {passwordError && (
                  <span className="error-message">{passwordError}</span>
                )}
              </div>
              <div className="gap" />

              <button className="btn" type="submit" onClick={handleSubmit}>
                Login
              </button>
              {/* </form> */}

              <div className="social-sign-in">
                <div
                  className="SignInWithGoogle"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontSize: 14,
                    fontFamily: "Roboto",
                    fontWeight: "500",
                    wordWrap: "break-word",
                    padding: 5,
                    border: "1px solid #000",
                    borderRadius: "5px",
                    width: 190,
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
                </div>
                <div
                  className="SignInWithApple"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontSize: 14,
                    fontFamily: "Roboto",
                    fontWeight: "500",
                    wordWrap: "break-word",
                    padding: 5,
                    border: "1px solid #000",
                    borderRadius: "5px",
                    width: 190,
                  }}
                >
                  <FontAwesomeIcon icon={faApple} /> Sign in with Apple
                </div>
              </div>

              <p
                className="right-container__bottom-text"
                style={{
                  color: "black",
                  fontSize: 16,
                  fontFamily: "Roboto",
                  fontWeight: "500",
                  wordWrap: "break-word",
                  marginTop: "10px",
                  marginRight: 8,
                }}
              >
                New on our platform?
                <strong style={{ marginLeft: 10 }}>
                  <Link to="/Register">Create account</Link>
                </strong>
              </p>
            </div>
          </div>
          <div className="image-container">
            <div>
              <img src={loginPage_img} alt="img" className="image1" />

              <img
                src={registerPage2_img}
                alt="img"
                className="image2"
                style={{
                  // width: 450,
                  height: "100vh",
                  right: 0,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
