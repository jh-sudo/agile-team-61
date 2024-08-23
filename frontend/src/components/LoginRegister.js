import React, { useState, useContext } from "react";
import "./LoginRegister.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function LoginRegister({ closePopup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/signup",
        { username, email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        login();
        closePopup();
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMessage("User already exists with this email.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const signIn = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const res = await axios.post(
        "http://localhost:3001/api/signin",
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        login();
        closePopup();
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const toggleForm = () => {
    setErrorMessage("");
    setUsername("");
    setEmail(""); 
    setPassword("");
  };

  return (
    <div className="content" id="content">
      <div className="left-box col-md-6 justify-content-center">
        <form onSubmit={register}>
          <div className="header-text mb-4">
            <h1>Create Account</h1>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Name"
              className="form-control form-control-lg bg-light fs-6"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control form-control-lg bg-light fs-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control form-control-lg bg-light fs-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group mb-3 justify-content-center">
            <button className="btn border-white text-white w-50 fs-6">Sign Up</button>
          </div>
        </form>
      </div>
      <div className="col-md-6 right-box">
        <form onSubmit={signIn}>
          <div className="header-text mb-4">
            <h1>Sign In</h1>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <div className="input-group mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control form-control-lg bg-light fs-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control form-control-lg bg-light fs-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group mb-3 justify-content-center">
            <button className="btn border-white text-white w-50 fs-6">Sign In</button>
          </div>
        </form>
      </div>
      <div className="switch-content">
        <div className="switch">
          <div className="switch-panel switch-left">
            <h1>Welcome</h1>
            <p>Join Our Unique Platform, Explore a New Experience</p>
            <button
              className="hidden btn text-white w-50 fs-6"
              onClick={() => {
                document.getElementById("content").classList.remove("active");
                toggleForm();
              }}
            >
              Login
            </button>
          </div>
          <div className="switch-panel switch-right">
            <h1>Hello, Again</h1>
            <p>We are happy to see you back</p>
            <button
              className="hidden btn text-white w-50 fs-6"
              onClick={() => {
                document.getElementById("content").classList.add("active");
                toggleForm();
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
