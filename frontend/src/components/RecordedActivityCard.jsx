import React from "react";
import css from "../styles/HomePage.module.css";
import { getActivityIcon, getDurationString, getIntensityString } from "../utils/activityUtils.js";
import { formatForDateTimeLocal, getDateAndTime } from "../utils/dateUtils.js";
import { getAsset, iconEditSrc } from "../utils/assetUtils.js";
import StatDisplay from "./StatDisplay.jsx";

const defaultConfig = {
  distance_m_toggle: true,
  duration_ms_toggle: true,
  laps_toggle: true,
  intensity_level_toggle: true,
};

const RecordedActivityCard = (props) => {
  const { _id: id, type, activity_date, distance_m, duration_ms, laps, intensity_level, comments } = props.data;
  const { distance_m_toggle, duration_ms_toggle, laps_toggle, intensity_level_toggle } = props.config || defaultConfig;
  return (
    <div className={css["rec-activity-card-container"]}>
      <div className={css["rec-activity-card-header"]}>
        <div className={css["header-info"]}>
          <img className={css["rec-activity-type-icon"]} src={getActivityIcon(type)} alt={`icon image for ${type}`} />
          <div>
            <div className={css["header-title"]}>{type}</div>
            <div className={css["header-sub"]}>{getDateAndTime(formatForDateTimeLocal(activity_date))[0]}</div>
          </div>
        </div>
        <button className={css["action-icon-button"]}>
          <img
            className={css["button-icon"]}
            src={getAsset(iconEditSrc)}
            alt="edit icon"
            onClick={() => props.onClick(id)}
          />
        </button>
      </div>
      <div className={css["comment"]}>{comments}</div>
      <div className={css["stat-list"]}>
        {distance_m_toggle && <StatDisplay label="Distance" value={distance_m} />}
        {duration_ms_toggle && <StatDisplay label="Duration" value={getDurationString(duration_ms)} />}
        {laps_toggle && <StatDisplay label="Laps" value={laps} />}
        {intensity_level_toggle && <StatDisplay label="Intensity" value={getIntensityString(intensity_level)} />}
      </div>
    </div>
  );
};

export default RecordedActivityCard;
