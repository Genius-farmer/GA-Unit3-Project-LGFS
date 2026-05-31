import React, { useContext, useEffect, useRef, useState } from "react";
import css from "../styles/HomePage.module.css";
import StatSelect from "./StatSelect.jsx";
import StatDateInput from "./StatDateInput.jsx";
import StatTextInput from "./StatTextInput.jsx";
import StatMultiTextInput from "./StatMultiTextInput.jsx";
import StatTextarea from "./StatTextarea.jsx";
import { getAsset, iconCloseSrc, iconDeleteSrc } from "../utils/assetUtils.js";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";
import UserContext from "../context/UserContext.js";
import { getDurationArray, getDurationInMs } from "../utils/activityUtils.js";
import { getDateLocal } from "../utils/dateUtils.js";
import { retainDigits } from "../utils/dataSanitizeUtils.js";

const intensityMappings = [
  { name: "Low", value: 1 },
  { name: "Medium", value: 2 },
  { name: "High", value: 3 },
];

const defaultConfig = {
  distance_m_toggle: true,
  duration_ms_toggle: true,
  laps_toggle: true,
  intensity_level_toggle: true,
};

const UpdateRecordedActivityDialog = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const [isReady, setIsReady] = useState(false);
  const dialogRef = useRef(null);

  const [type, setType] = useState("");
  const [date, setDate] = useState(getDateLocal(new Date()));
  const [distance, setDistance] = useState(0);
  const [durationH, setDurationH] = useState(0);
  const [durationM, setDurationM] = useState(0);
  const [durationS, setDurationS] = useState(0);
  const [laps, setLaps] = useState(0);
  const [intensity, setIntensity] = useState(1);
  const [comments, setComments] = useState("");

  const [activity, setActivity] = useState({ types: [], configs: [] });

  const [showDistance, setShowDistance] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [showLaps, setShowLaps] = useState(false);
  const [showIntensity, setShowIntensity] = useState(false);

  const getActivityAndConfig = async () => {
    const res = await fetchData(userEndpoints.getActivityConfigs, "GET", {});
    if (!res.ok) {
      console.log("failed to get activity configs");
      return;
    }

    const activityTypes = res.data.result.reduce((arr, current) => {
      arr.push({ name: current.type, value: current.type });
      return arr;
    }, []);

    const activityObj = { types: activityTypes, configs: res.data.result };
    setActivity(activityObj);
    setType(activityObj.types[0].value);
    updateToggles(activityObj.configs[0]);

    const res2 = await fetchData(userEndpoints.getRecordedActivityById, "POST", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { recorded_activity_id: props.id },
    });

    if (!res2.ok) {
      console.log("failed to get activity");
      return;
    }

    const { type, activity_date, distance_m, duration_ms, laps, intensity_level, comments } = res2.data.result;
    setType(type);
    setDate(getDateLocal(new Date(activity_date)));

    setDistance(distance_m);

    const durationArray = getDurationArray(duration_ms);
    setDurationH(durationArray[0]);
    setDurationM(durationArray[1]);
    setDurationS(durationArray[2]);

    setLaps(laps);
    setIntensity(intensity_level);
    setComments(comments);

    setIsReady(true);
  };

  const updateToggles = (config) => {
    setShowDistance(config.distance_m_toggle);
    setShowDuration(config.duration_ms_toggle);
    setShowLaps(config.laps_toggle);
    setShowIntensity(config.intensity_level_toggle);

    setDistance(0);
    setDurationH(0);
    setDurationM(0);
    setDurationS(0);
    setLaps(0);
    setIntensity(1);
  };

  useEffect(() => {
    getActivityAndConfig();
  }, []);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    dialogNode.showModal();

    const handleCancel = (event) => {
      event.preventDefault();
      props.onClose();
    };
    dialogNode.addEventListener("cancel", handleCancel);

    return () => {
      dialogNode.removeEventListener("cancel", handleCancel);
    };
  }, [props.onClose]);

  useEffect(() => {
    if (activity.configs.length > 0) {
      const config = activity.configs.find((item) => item.type === type) || defaultConfig;
      updateToggles(config);
    }
  }, [type]);

  const handleUpdate = () => {
    submitActivity();
  };

  const submitActivity = async () => {
    const body = {
      recorded_activity_id: props.id,
      type,
      activity_date: date,
      comments: comments,
    };
    if (showDistance) body.distance_m = distance;
    if (showDuration) body.duration_ms = getDurationInMs(durationH, durationM, durationS);
    if (showLaps) body.laps = laps;
    if (showIntensity) body.intensity_level = intensity;

    const res = await fetchData(userEndpoints.updateRecordedActivityById, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body,
    });
    if (!res.ok) {
      console.log("failed to update activity");
      return;
    }

    props.onClose(true);
  };

  const handleDelete = () => {
    deleteActivity();
  };

  const deleteActivity = async () => {
    const res = await fetchData(userEndpoints.deleteRecordedActivityById, "DELETE", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { recorded_activity_id: props.id },
    });
    if (!res.ok) {
      console.log("failed to delete activity");
      return;
    }

    props.onClose(true);
  };

  return (
    <dialog className={css["dialog-box"]} ref={dialogRef}>
      <div className={`${css["panel-header-wrapper"]} ${css["flex-between"]}`}>
        <div className={css["panel-header"]}>Edit Activity</div>
        <button className={`${css["action-icon-button"]} ${css["button-border"]}`} onClick={props.onClose}>
          <img className={css["button-icon"]} src={getAsset(iconCloseSrc)} alt={`close icon`} />
        </button>
      </div>
      {!isReady && <div>Please wait...</div>}
      {isReady && (
        <div className={css["dialog-card"]}>
          <div className={css["dialog-row"]}>
            <StatSelect
              title="Activity"
              value={type}
              setValue={setType}
              size={css["stat-input-md"]}
              options={activity.types}
            />
            <StatDateInput title="Date" value={date} setValue={setDate} size={css["stat-input-sm"]} />
          </div>
          <div className={css["dialog-row"]}>
            {showDistance && (
              <StatTextInput
                title="Distance"
                value={distance}
                setValue={setDistance}
                size={css["stat-input-sm"]}
                unit="meters"
                maxLength={5}
                sanitizer={retainDigits}
              />
            )}
            {showDuration && (
              <StatMultiTextInput
                title="Duration"
                size={css["stat-input-md"]}
                items={[
                  { value: durationH, setValue: setDurationH, unit: "hr", maxLength: 3 },
                  { value: durationM, setValue: setDurationM, unit: "min", maxLength: 2 },
                  { value: durationS, setValue: setDurationS, unit: "sec", maxLength: 2 },
                ]}
                sanitizer={retainDigits}
              />
            )}
          </div>
          <div className={css["dialog-row"]}>
            {showLaps && (
              <StatTextInput
                title="Laps"
                value={laps}
                setValue={setLaps}
                size={css["stat-input-sm"]}
                unit="laps"
                maxLength={3}
                sanitizer={retainDigits}
              />
            )}
            {showIntensity && (
              <StatSelect
                title="Intensity"
                value={intensity}
                setValue={setIntensity}
                size={css["stat-input-sm"]}
                options={intensityMappings}
              />
            )}
          </div>
          <StatTextarea
            title="Comment"
            value={comments}
            setValue={setComments}
            size={css["stat-input-lg"]}
            maxLength={500}
          />
          <div className={css["dialog-footer"]}>
            <div>
              <button className={css["text-button"]} onClick={handleUpdate}>
                Update
              </button>
              <button className={css["text-button-cancel"]} onClick={props.onClose}>
                Cancel
              </button>
            </div>
            <div>
              <button className={`${css["action-icon-button"]} ${css["button-border"]}`} onClick={handleDelete}>
                <img className={css["button-icon"]} src={getAsset(iconDeleteSrc)} alt={`trash icon`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default UpdateRecordedActivityDialog;
