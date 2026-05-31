import React, { useContext } from "react";
import { NavLink } from "react-router";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";

import logoImage from "../assets/images/nav-logo.png";
import profileImage from "../assets/images/default-profile-portrait.png";

const UserNavBar = () => {
  const userCtx = useContext(UserContext);

  return (
    <nav className={`${css["nav-container"]}`}>
      <img className={`${css["nav-logo"]}`} src={logoImage} />
      <div className={`${css["nav-links"]}`}>
        <div className={`${css["nav-primary"]}`}>
          <NavLink to="/user/dashboard" data-text="Dashboard">
            Dashboard
          </NavLink>
        </div>
        <div className={`${css["nav-secondary"]}`}>
          <div className={`${css["profile-link"]}`}>
            <img className={`${css["profile-img"]}`} src={profileImage} />
            <NavLink to="/user/profile" data-text="Profile">
              {userCtx.displayName}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
