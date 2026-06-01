import React from "react";
import css from "../styles/HomePage.module.css";

const RightPanel = () => {
  return (
    <div className={css["right-panel"]}>
      <div className={css["panel-header"]}>Future Features</div>
      <div className={css["future-feature-wrapper"]}>
        <div className={css["future-feature-description"]}>
          Watch this space as we add new features to help you be a better you.
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
