// /src/components/Login.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import "../assets/css/login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(login(email, password));
  };

  const handleGoogleSignIn = () => {
    window.location.href = "your-google-oauth-url";
  };

  const handleFacebookSignIn = () => {
    window.location.href = "your-facebook-oauth-url";
  };

  const handleMicrosoftSignIn = () => {
    window.location.href = "your-microsoft-oauth-url";
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {auth.error && <p style={{ color: "red" }}>{auth.error}</p>}
        <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
        </form>

        {/* Social Sign-In Section */}
        <div className="social-login">
          <p>__ Or sign in with __</p>
          <div className="social-buttons">
            <button className="google-button" onClick={handleGoogleSignIn}>
              <FontAwesomeIcon icon={faGoogle} /> Google
            </button>
            <button className="facebook-button" onClick={handleFacebookSignIn}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook
            </button>
            <button className="microsoft-button" onClick={handleMicrosoftSignIn}>
              <FontAwesomeIcon icon={faMicrosoft} /> Microsoft
            </button>
          </div>
        </div>

        <div className="form-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
