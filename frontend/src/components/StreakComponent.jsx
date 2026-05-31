import React from "react";
import css from "../styles/HomePage.module.css";
import { formatForDateTimeLocal, getDateLocal } from "../utils/dateUtils.js";

const StreakComponent = (props) => {
  return (
    <>
      <div className={css["stat-label"]}>Weekly Streak</div>
      <div className={css["streak-container"]}>
        {props.weekStreak &&
          ["M", "T", "W", "T", "F", "S", "S"].map((label, idx) => (
            <div key={idx} className={css["streak-day"]}>
              <div className={css["streak-label"]}>{label}</div>
              <div className={props.weekStreak[idx] ? css["streak-on"] : css["streak-off"]}>●</div>
            </div>
          ))}
      </div>
    </>
  );
};

export default StreakComponent;
