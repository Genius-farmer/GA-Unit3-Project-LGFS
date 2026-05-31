import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import { getProfileIcon } from "../utils/profileUtils.js";
import UserContext from "../context/UserContext.js";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";
import { getDurationString, getDurationStringInHours } from "../utils/activityUtils.js";
import { formatForDateTimeLocal, getDateAndTime } from "../utils/dateUtils.js";

const ProfilePanel = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [activitiesCount, setActivitiesCount] = useState(0);
  const [activitiesDuration, setActivitiesDuration] = useState("-");
  const [latestActivity, setLatestActivity] = useState({ type: "", date: "" });

  const getLatest = (activities) => {
    const latestActivity = activities.reduce((latest, current) => {
      return new Date(current.activity_date) > new Date(latest.activity_date) ? current : latest;
    });
    return latestActivity;
  };

  const getDetails = async () => {
    const res = await fetchData(userEndpoints.getRecordedActivities, "GET", {
      auth: getBearerHeader(userCtx.accessToken),
    });

    if (!res.ok && res.status === 401) {
      console.log(res.status, res.message);
      if (props.notAuth) props.notAuth();
      return;
    }

    setActivitiesCount(res.data?.result.length);

    const totalMs = res.data?.result.reduce((sum, activity) => sum + activity.duration_ms, 0);
    setActivitiesDuration(getDurationStringInHours(totalMs));

    const { type, activity_date } = getLatest(res.data?.result);
    setLatestActivity({ type, date: getDateAndTime(formatForDateTimeLocal(activity_date))[0] });
  };

  useEffect(() => {
    getDetails();
  }, [props.reload]);

  return (
    <div className={css["profile-panel"]}>
      <div className={`${css["panel-header"]} ${css["panel-header-profile"]}`}>&nbsp;</div>
      <div className={css["profile-panel-card"]}>
        <img className={css["profile-panel-icon"]} src={getProfileIcon(0)} alt="profile icon" />
        <div className={css["greeting"]}>Hello {userCtx.displayName}!</div>
        <div className={`${css["stat-list"]}`}>
          <div className={`${css["stat"]} ${css["stat-list-profile"]}`}>
            <div className={`${css["stat-label"]}`}>Activities</div>
            <div className={`${css["stat-value"]}`}>{activitiesCount}</div>
          </div>
          <div className={`${css["stat"]} ${css["stat-list-profile"]}`}>
            <div className={`${css["stat-label"]}`}>Total Duration</div>
            <div className={`${css["stat-value"]}`}>{activitiesDuration}</div>
          </div>
        </div>
      </div>
      <div className={css["profile-panel-card"]}>
        <div className={`${css["stat-list"]}`}>
          <div className={`${css["stat"]} ${css["stat-list-profile"]}`}>
            <div className={`${css["stat-label"]}`}>Latest activity</div>
            <div className={`${css["stat-value"]}`}>
              {latestActivity.type} <span>:: {latestActivity.date}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={css["profile-panel-card"]}>
        <div>STREAK COMPONENT</div>
      </div>
    </div>
  );
};

export default ProfilePanel;
