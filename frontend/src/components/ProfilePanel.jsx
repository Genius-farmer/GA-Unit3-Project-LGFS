import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import { getProfileIcon } from "../utils/profileUtils.js";
import UserContext from "../context/UserContext.js";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";
import { getDurationString, getDurationStringInHours, getActivityIcon } from "../utils/activityUtils.js";
import { formatForDateTimeLocal, getDateAndTime, getDateLocal, getWeekDays } from "../utils/dateUtils.js";
import StreakComponent from "./StreakComponent.jsx";
import StatDisplay from "./StatDisplay.jsx";

const ProfilePanel = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [activitiesCount, setActivitiesCount] = useState(0);
  const [activitiesDuration, setActivitiesDuration] = useState("-");
  const [latestActivity, setLatestActivity] = useState({ type: "", date: "" });
  const [weekStreak, setWeekStreak] = useState([false, false, false, false, false, false, false]);

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

    const activities = res.data?.result;
    setActivitiesCount(activities.length);

    const totalMs = activities.reduce((sum, activity) => sum + activity.duration_ms, 0);
    setActivitiesDuration(getDurationStringInHours(totalMs));

    if (activities.length > 0) {
      const { type, activity_date } = getLatest(activities);
      setLatestActivity({
        type,
        date: getDateAndTime(formatForDateTimeLocal(activity_date))[0],
      });
    }

    const activityDates = new Set(activities.map((a) => getDateAndTime(formatForDateTimeLocal(a.activity_date))[0]));
    const weekDays = getWeekDays();
    setWeekStreak(weekDays.map((day) => activityDates.has(day)));
  };

  useEffect(() => {
    getDetails();
  }, [props.reload]);

  return (
    <div className={css["profile-panel"]}>
      <div className={`${css["panel-header"]} ${css["panel-header-profile"]}`}>&nbsp;</div>
      <div className={css["profile-panel-card"]}>
        <img className={css["profile-panel-icon"]} src={getProfileIcon(userCtx.profileImage)} alt="profile icon" />
        <div className={css["greeting"]}>Hello {userCtx.displayName}!</div>
        <div className={css["stat-list"]}>
          <StatDisplay addCss={css["stat-list-profile"]} label="Activities" value={activitiesCount} />
          <StatDisplay addCss={css["stat-list-profile"]} label="Total Duration" value={activitiesDuration} />
        </div>
      </div>
      <div className={css["profile-panel-card"]}>
        <div className={css["stat-list"]}>
          <StatDisplay
            addCss={css["stat-list-profile"]}
            label="Latest activity"
            value={
              <>
                {latestActivity.type && (
                  <>
                    {latestActivity.type} <span>:: {latestActivity.date}</span>
                  </>
                )}
                {!latestActivity.type && "No activities yet"}
              </>
            }
          />
        </div>
      </div>
      <div className={css["profile-panel-card"]}>
        <StreakComponent weekStreak={weekStreak} />
      </div>
    </div>
  );
};

export default ProfilePanel;
