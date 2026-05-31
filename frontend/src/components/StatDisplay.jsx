import React from "react";
import css from "../styles/HomePage.module.css";

const StatDisplay = (props) => {
  const baseCss = [css["stat"]];
  if (props.addCss) baseCss.push(props.addCss);
  return (
    <div className={baseCss.join(" ")}>
      <div className={css["stat-label"]}>{props.label}</div>
      <div className={css["stat-value"]}>{props.value}</div>
    </div>
  );
};

export default StatDisplay;
