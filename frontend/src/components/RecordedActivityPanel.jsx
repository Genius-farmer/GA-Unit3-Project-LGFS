import React, { useContext, useEffect, useState } from "react";
import RecordedActivityCard from "./RecordedActivityCard.jsx";
import css from "../styles/HomePage.module.css";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";
import UserContext from "../context/UserContext.js";
import { getAsset, iconAddSrc } from "../utils/assetUtils.js";
import AddRecordedActivityDialog from "./AddRecordedActivityDialog.jsx";
import UpdateRecordedActivityDialog from "./UpdateRecordedActivityDialog.jsx";

const RecordedActivityPanel = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [activities, setActivities] = useState([]);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [configs, setConfigs] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const getActivitiesAndConfig = async () => {
    const res = await fetchData(userEndpoints.getRecordedActivities, "GET", {
      auth: getBearerHeader(userCtx.accessToken),
    });

    if (!res.ok && res.status === 401) {
      console.log(res.status, res.message);
      if (props.notAuth) props.notAuth();
      return;
    }

    const sorted = res.data?.result.toSorted(
      (a, b) =>
        new Date(b.activity_date) - new Date(a.activity_date) || new Date(b.created_at) - new Date(a.created_at),
    );

    const res2 = await fetchData(userEndpoints.getActivityConfigs, "GET", {});
    if (!res2.ok) {
      console.log("failed to get activity configs");
      return;
    }
    setConfigs(res2.data.result);
    setActivities(sorted);
    setIsReady(true);
  };

  useEffect(() => {
    getActivitiesAndConfig();
  }, [props.reload]);

  const handleAddActivity = () => {
    setIsAddActivityOpen(true);
  };

  const handleAddActivityClose = (reload = false) => {
    if (reload) props.setReload((prev) => prev + 1);
    setIsAddActivityOpen(false);
  };

  const handleEditActivity = (activityId) => {
    setEditId(activityId);
    setIsEditActivityOpen(true);
  };

  const handleEditActivityClose = (reload = false) => {
    if (reload) props.setReload((prev) => prev + 1);
    setIsEditActivityOpen(false);
  };

  const getConfig = (type) => {
    return configs.find((item) => item.type === type);
  };

  return (
    <>
      {isAddActivityOpen && <AddRecordedActivityDialog onClose={handleAddActivityClose} />}
      {isEditActivityOpen && <UpdateRecordedActivityDialog id={editId} onClose={handleEditActivityClose} />}
      <div className={css["rec-activity-panel"]}>
        <div className={css["panel-header-wrapper"]}>
          <div className={css["panel-header"]}>Activity Feeds</div>
          <button className={`${css["action-icon-button"]} ${css["button-border"]}`} onClick={handleAddActivity}>
            <img className={css["button-icon"]} src={getAsset(iconAddSrc)} alt={`add activitiy icon`} />
          </button>
        </div>
        {isReady &&
          activities.length > 0 &&
          activities.map((item) => (
            <RecordedActivityCard
              key={item._id}
              data={item}
              config={getConfig(item.type)}
              onClick={handleEditActivity}
            />
          ))}
        {isReady && !(activities.length > 0) && (
          <div className={css["rec-activity-card-container"]}>
            You have no activities. <br />
            Start recording one now.
          </div>
        )}
      </div>
    </>
  );
};

export default RecordedActivityPanel;
