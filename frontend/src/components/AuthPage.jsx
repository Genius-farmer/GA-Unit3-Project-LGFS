import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/UserContext.js";
import { sharedFetch } from "../utils/fetchingUtils.js";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleToggle = () => {
    clearMessages();
    setIsLogin((prev) => !prev);
  };

  const handleLogin = async () => {
    clearMessages();
    const res = await fetchData("/api/accounts/login", "POST", {
      body: { username, password },
    });

    if (res.ok) {
      const decoded = jwtDecode(res.data.data.access);
      userCtx.setAccessToken(res.data.data.access);
      userCtx.setDisplayName(decoded.displayName || decoded.username);
      userCtx.setRole(decoded.role);
      if (decoded.role === "admin") {
        navigate("/admin/configs");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegister = async () => {
    clearMessages();
    const res = await fetchData("/api/accounts/register", "PUT", {
      body: { username, password },
    });

    if (res.ok) {
      setSuccessMessage("Account created! Please log in.");
      setIsLogin(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <label>
        Username
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={handleToggle}>{isLogin ? "Register" : "Login"}</button>
      </p>
    </div>
  );
};

export default AuthPage;
