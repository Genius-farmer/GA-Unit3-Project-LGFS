import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import { getProfileIcon } from "../utils/profileUtils.js";
import UserContext from "../context/UserContext.js";
import {
  getBearerHeader,
  sharedFetch,
  userEndpoints,
} from "../utils/fetchingUtils.js";
import {
  getDurationString,
  getDurationStringInHours,
  getActivityIcon,
} from "../utils/activityUtils.js";
import {
  formatForDateTimeLocal,
  getDateAndTime,
  getDateLocal,
} from "../utils/dateUtils.js";

const getWeekDays = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(getDateLocal(d)); // returns "YYYY-MM-DD"
  }
  return days;
};

const ProfilePanel = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [activitiesCount, setActivitiesCount] = useState(0);
  const [activitiesDuration, setActivitiesDuration] = useState("-");
  const [latestActivity, setLatestActivity] = useState({ type: "", date: "" });
  const [weekStreak, setWeekStreak] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const getLatest = (activities) => {
    const latestActivity = activities.reduce((latest, current) => {
      return new Date(current.activity_date) > new Date(latest.activity_date)
        ? current
        : latest;
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

    const totalMs = activities.reduce(
      (sum, activity) => sum + activity.duration_ms,
      0,
    );
    setActivitiesDuration(getDurationStringInHours(totalMs));

    if (activities.length > 0) {
      const { type, activity_date } = getLatest(activities);
      setLatestActivity({
        type,
        date: getDateAndTime(formatForDateTimeLocal(activity_date))[0],
      });
    }

    const activityDates = new Set(
      activities.map(
        (a) => getDateAndTime(formatForDateTimeLocal(a.activity_date))[0],
      ),
    );
    const weekDays = getWeekDays();
    setWeekStreak(weekDays.map((day) => activityDates.has(day)));
  };

  useEffect(() => {
    getDetails();
  }, [props.reload]);

  return (
    <div className={css["profile-panel"]}>
      <div className={`${css["panel-header"]} ${css["panel-header-profile"]}`}>
        &nbsp;
      </div>
      <div className={css["profile-panel-card"]}>
        <img
          className={css["profile-panel-icon"]}
          src={getProfileIcon(0)}
          alt="profile icon"
        />
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
              {latestActivity.type ? (
                <>
                  <img
                    src={getActivityIcon(latestActivity.type)}
                    style={{ width: "20px", height: "20px" }}
                    alt={latestActivity.type}
                  />
                  {" - "}
                  {latestActivity.type}
                </>
              ) : (
                "No activities yet"
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={css["profile-panel-card"]}>
        <div className={`${css["stat-label"]}`}>Weekly Streak</div>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((label, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div>{label}</div>
              <div style={{ color: weekStreak[idx] ? "green" : "lightgray" }}>
                ●
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
