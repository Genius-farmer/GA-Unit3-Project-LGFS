import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/UserContext.js";
import { sharedFetch } from "../utils/fetchingUtils.js";
import css from "../styles/App.module.css";
import { getAsset, navLogoSrc } from "../utils/assetUtils.js";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [displayName, setDisplayName] = useState("");

  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleToggle = () => {
    clearMessages();
    setDisplayName("");
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
      body: { username, password, displayName },
    });

    if (res.ok) {
      setSuccessMessage("Account created! Please log in.");
      setIsLogin(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className={css["auth-wrapper"]}>
      <div className={css["auth-card"]}>
        {/* LEFT — login form */}
        <div className={css["auth-left"]}>
          <img
            className={css["auth-logo"]}
            src={getAsset(navLogoSrc)}
            alt="logo"
          />
          <div className={css["auth-title"]}>
            {isLogin ? "Login" : "Register"}
          </div>

          <div className={css["auth-field"]}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className={css["auth-field"]}>
              <label>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          )}

          <div className={css["auth-field"]}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className={css["auth-error"]}>{errorMessage}</p>
          )}
          {successMessage && (
            <p className={css["auth-success"]}>{successMessage}</p>
          )}

          <button
            className={css["text-button"]}
            onClick={isLogin ? handleLogin : handleRegister}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <div className={css["auth-footer"]}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className={css["auth-toggle-btn"]} onClick={handleToggle}>
              {isLogin ? "Register" : "Login"}
            </button>
          </div>
        </div>

        {/* RIGHT — app description */}
        <div className={css["auth-right"]}>
          <div className={css["auth-description"]}>
            <div className={css["auth-description-subtitle"]}>
              A fitness tracking app that helps you record movement, build
              habits, and progress with confidence.
            </div>
            <div className={css["auth-description-line"]}>
              Record your movement.
              <br />
              See your progress.
            </div>
            <div className={css["auth-description-line"]}>
              Start recording.
              <br />
              Keep progressing.
            </div>
            <div className={css["auth-description-line"]}>
              Log your fitness.
              <br />
              See your growth.
            </div>
            <div className={css["auth-description-line"]}>
              Record today.
              <br />
              Move better tomorrow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
