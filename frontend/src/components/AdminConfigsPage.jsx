import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import {
  getBearerHeader,
  sharedFetch,
  userEndpoints,
} from "../utils/fetchingUtils.js";

const AdminConfigsPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const [configs, setConfigs] = useState([]);
  const [msg, setMsg] = useState("");

  // Form state for creating new config
  const [type, setType] = useState("");
  const [distanceToggle, setDistanceToggle] = useState(true);
  const [durationToggle, setDurationToggle] = useState(true);
  const [lapsToggle, setLapsToggle] = useState(true);
  const [intensityToggle, setIntensityToggle] = useState(true);
  const [commentsToggle, setCommentsToggle] = useState(true);

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
    setMsg("");
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
      setMsg(res.message || "Failed to create.");
      return;
    }
    setMsg("Activity config created!");
    setType("");
    loadConfigs();
  };

  const handleDelete = async (id) => {
    const res = await fetchData(userEndpoints.deleteAdminConfig, "DELETE", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { activity_config_id: id },
    });
    if (!res.ok) {
      setMsg(res.message || "Failed to delete.");
      return;
    }
    loadConfigs();
  };

  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <button onClick={() => navigate("/admin/configs")}>
              Activity Configs
            </button>
            <button onClick={() => navigate("/admin/accounts")}>
              User Accounts
            </button>
          </div>

          {/* Create new config */}
          <div className={css["profile-panel-card"]}>
            <div className={css["panel-header"]}>Add Activity Config</div>
            <form onSubmit={handleCreate}>
              <div>
                <label>Activity Type Name</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div>
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
              {msg && <div>{msg}</div>}
              <button type="submit">Create</button>
            </form>
          </div>

          {/* Existing configs list */}
          <div
            className={css["profile-panel-card"]}
            style={{ marginTop: "16px" }}
          >
            <div className={css["panel-header"]}>Existing Configs</div>
            {configs.length === 0 && <div>No configs yet.</div>}
            {configs.map((c) => (
              <div
                key={c._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <div>
                  <strong>{c.type}</strong>
                  <span style={{ marginLeft: "12px", fontSize: "12px" }}>
                    {[
                      c.distance_m_toggle && "Distance",
                      c.duration_ms_toggle && "Duration",
                      c.laps_toggle && "Laps",
                      c.intensity_level_toggle && "Intensity",
                      c.comments_toggle && "Comments",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AdminConfigsPage;
