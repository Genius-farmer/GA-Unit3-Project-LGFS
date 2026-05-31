import React from "react";
import css from "../styles/ToggleButton.module.css";

const ToggleButton = (props) => {
  const handleToggle = () => {
    if (props.setIsChecked) props.setIsChecked((prev) => !prev);
  };

  return (
    <div className={css["toggle-container"]}>
      <div className={css["toggle-track"]} onClick={handleToggle}>
        <div className={css["toggle-thumb"]}>
          <input
            className={css["toggle-input"]}
            type="checkbox"
            checked={props.isChecked}
            onChange={(e) => props.setIsChecked(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;
