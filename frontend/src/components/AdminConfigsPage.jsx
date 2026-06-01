import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import AdminNavBar from "./AdminNavBar.jsx";
import { getAsset, iconEditSrc, iconDeleteSrc } from "../utils/assetUtils.js";
import {
  getBearerHeader,
  sharedFetch,
  userEndpoints,
} from "../utils/fetchingUtils.js";

const AdminConfigsPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [configs, setConfigs] = useState([]);
  const [createMsg, setCreateMsg] = useState("");

  // Create form state
  const [type, setType] = useState("");
  const [distanceToggle, setDistanceToggle] = useState(true);
  const [durationToggle, setDurationToggle] = useState(true);
  const [lapsToggle, setLapsToggle] = useState(true);
  const [intensityToggle, setIntensityToggle] = useState(true);
  const [commentsToggle, setCommentsToggle] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState("");
  const [editDistance, setEditDistance] = useState(false);
  const [editDuration, setEditDuration] = useState(false);
  const [editLaps, setEditLaps] = useState(false);
  const [editIntensity, setEditIntensity] = useState(false);
  const [editComments, setEditComments] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  const loadConfigs = async () => {
    const res = await fetchData(userEndpoints.getAdminConfigs, "GET", {
      auth: getBearerHeader(userCtx.accessToken),
    });
    if (!res.ok) return;
    setConfigs(res.data.result);
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateMsg("");
    const res = await fetchData(userEndpoints.createAdminConfig, "PUT", {
      auth: getBearerHeader(userCtx.accessToken),
      body: {
        type,
        distance_m_toggle: distanceToggle,
        duration_ms_toggle: durationToggle,
        laps_toggle: lapsToggle,
        intensity_level_toggle: intensityToggle,
        comments_toggle: commentsToggle,
      },
    });
    if (!res.ok) {
      setCreateMsg(res.message || "Failed to create.");
      return;
    }
    setCreateMsg("Activity config created!");
    setType("");
    loadConfigs();
  };

  const handleEditOpen = (config) => {
    setEditingId(config._id);
    setEditType(config.type);
    setEditDistance(config.distance_m_toggle);
    setEditDuration(config.duration_ms_toggle);
    setEditLaps(config.laps_toggle);
    setEditIntensity(config.intensity_level_toggle);
    setEditComments(config.comments_toggle);
    setEditMsg("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditMsg("");
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setEditMsg("");
    const res = await fetchData(userEndpoints.updateAdminConfig, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body: {
        activity_config_id: id,
        type: editType,
        distance_m_toggle: editDistance,
        duration_ms_toggle: editDuration,
        laps_toggle: editLaps,
        intensity_level_toggle: editIntensity,
        comments_toggle: editComments,
      },
    });
    if (!res.ok) {
      setEditMsg(res.message || "Failed to update.");
      return;
    }
    setEditingId(null);
    loadConfigs();
  };

  const handleDelete = async (id) => {
    const res = await fetchData(userEndpoints.deleteAdminConfig, "DELETE", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { activity_config_id: id },
    });
    if (!res.ok) return;
    loadConfigs();
  };

  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        <AdminNavBar />
        <div className={css["user-dashboard"]}>
          <div></div>
          <div className={css["admin-dashboard"]}>
          {/* LEFT — Create */}
          <div className={css["admin-panel"]}>
            <div className={css["admin-panel-card"]}>
              <div className={css["panel-header"]}>Create Configuration</div>
              <form onSubmit={handleCreate}>
                <div className={css["admin-form-field"]}>
                  <label>Activity Type Name</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
                <div className={css["admin-checkbox-list"]}>
                  <label>
                    <input
                      type="checkbox"
                      checked={distanceToggle}
                      onChange={(e) => setDistanceToggle(e.target.checked)}
                    />{" "}
                    Distance
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={durationToggle}
                      onChange={(e) => setDurationToggle(e.target.checked)}
                    />{" "}
                    Duration
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={lapsToggle}
                      onChange={(e) => setLapsToggle(e.target.checked)}
                    />{" "}
                    Laps
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={intensityToggle}
                      onChange={(e) => setIntensityToggle(e.target.checked)}
                    />{" "}
                    Intensity
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={commentsToggle}
                      onChange={(e) => setCommentsToggle(e.target.checked)}
                    />{" "}
                    Comments
                  </label>
                </div>
                {createMsg && (
                  <div
                    className={
                      createMsg.includes("created")
                        ? css["admin-msg-success"]
                        : css["admin-msg-error"]
                    }
                  >
                    {createMsg}
                  </div>
                )}
                <div className={css["dialog-footer"]}>
                  <button className={css["text-button"]} type="submit">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT — Existing configs */}
          <div className={css["admin-panel"]}>
            <div className={css["admin-panel-card"]}>
              <div className={css["panel-header"]}>Existing Configurations</div>
              {configs.length === 0 && <div>No configurations yet.</div>}
              {configs.map((c) => (
                <div key={c._id} className={css["admin-config-item"]}>
                  {editingId !== c._id ? (
                    <>
                      <div className={css["admin-config-item-header"]}>
                        <div className={css["header-title"]}>{c.type}</div>
                        <div>
                          <button
                            className={`${css["action-icon-button"]} ${css["button-border"]}`}
                            onClick={() => handleEditOpen(c)}
                          >
                            <img
                              className={css["button-icon"]}
                              src={getAsset(iconEditSrc)}
                              alt="edit"
                            />
                          </button>
                          <button
                            className={css["action-icon-button"]}
                            onClick={() => handleDelete(c._id)}
                          >
                            <img
                              className={css["button-icon"]}
                              src={getAsset(iconDeleteSrc)}
                              alt="delete"
                            />
                          </button>
                        </div>
                      </div>
                      <div className={css["admin-toggle-row"]}>
                        {[
                          c.distance_m_toggle && "Distance",
                          c.duration_ms_toggle && "Duration",
                          c.laps_toggle && "Laps",
                          c.intensity_level_toggle && "Intensity",
                          c.comments_toggle && "Comments",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </>
                  ) : (
                    <form onSubmit={(e) => handleUpdate(e, c._id)}>
                      <div className={css["admin-form-field"]}>
                        <label>Activity Type Name</label>
                        <input
                          type="text"
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          required
                        />
                      </div>
                      <div className={css["admin-checkbox-list"]}>
                        <label>
                          <input
                            type="checkbox"
                            checked={editDistance}
                            onChange={(e) => setEditDistance(e.target.checked)}
                          />{" "}
                          Distance
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={editDuration}
                            onChange={(e) => setEditDuration(e.target.checked)}
                          />{" "}
                          Duration
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={editLaps}
                            onChange={(e) => setEditLaps(e.target.checked)}
                          />{" "}
                          Laps
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={editIntensity}
                            onChange={(e) => setEditIntensity(e.target.checked)}
                          />{" "}
                          Intensity
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={editComments}
                            onChange={(e) => setEditComments(e.target.checked)}
                          />{" "}
                          Comments
                        </label>
                      </div>
                      {editMsg && (
                        <div className={css["admin-msg-error"]}>{editMsg}</div>
                      )}
                      <div className={css["dialog-footer"]}>
                        <div>
                          <button className={css["text-button"]} type="submit">
                            Save
                          </button>
                          <button
                            className={css["text-button-cancel"]}
                            type="button"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AdminConfigsPage;
