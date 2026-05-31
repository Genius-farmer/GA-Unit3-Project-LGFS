import React, { useContext } from "react";
import { NavLink } from "react-router";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import { defaultProfileSrc, getAsset, navLogoSrc } from "../utils/assetUtils.js";

const AdminNavBar = () => {
  const userCtx = useContext(UserContext);

  return (
    <nav className={css["nav-container"]}>
      <img className={css["nav-logo"]} src={getAsset(navLogoSrc)} />
      <div className={css["nav-links"]}>
        <div className={css["nav-primary"]}>
          <NavLink to="/admin/configs">Activity Configurations</NavLink>
          <NavLink to="/admin/accounts">User Accounts</NavLink>
        </div>
        <div className={css["nav-secondary"]}>
          <div className={css["profile-link"]}>
            <img className={css["profile-img"]} src={getAsset(defaultProfileSrc)} />
            <NavLink to="/user/profile" data-text="Profile">
              {userCtx.displayName}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
