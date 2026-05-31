import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import { getAsset, iconLogoutSrc, navLogoSrc } from "../utils/assetUtils.js";
import { getProfileIcon } from "../utils/profileUtils.js";

const UserNavBar = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    userCtx.setAccessToken("");
    navigate("/");
  };

  return (
    <nav className={css["nav-container"]}>
      <img className={css["nav-logo"]} src={getAsset(navLogoSrc)} />
      <div className={css["nav-links"]}>
        <div className={css["nav-primary"]}>
          <NavLink to="/user/dashboard">Dashboard</NavLink>
        </div>
        <div className={css["nav-secondary"]}>
          <div className={css["profile-link"]}>
            <img className={css["profile-img"]} src={getProfileIcon(userCtx.profileImage)} />
            <NavLink to="/user/profile" data-text="Profile">
              {userCtx.displayName}
            </NavLink>
          </div>
          <div>
            <button className={css["action-icon-button"]} onClick={handleLogout}>
              <img className={css["button-icon"]} src={getAsset(iconLogoutSrc)} alt="logout icon" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
