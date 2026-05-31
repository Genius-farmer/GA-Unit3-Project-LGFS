import React from "react";
import css from "../styles/HomePage.module.css";
import { getAsset, navLogoSrc } from "../utils/assetUtils.js";
import { useNavigate } from "react-router";

const FourOFour = () => {
  const navigate = useNavigate();
  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        <div className={css["prompt-box"]}>
          <img src={getAsset(navLogoSrc)} />
          <div className={css["exclaim"]}>404</div>
          <div>You've somehow gotten lost and ended up here.</div>
          <button onClick={() => navigate("/")}>Click here and head back</button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default FourOFour;
