import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import css from "../styles/HomePage.module.css";
import { getProfileIcon } from "../utils/profileUtils.js";
import UserContext from "../context/UserContext.js";
import {
  getBearerHeader,
  sharedFetch,
  userEndpoints,
} from "../utils/fetchingUtils.js";

const ProfilePage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const [profileIconId] = useState(() => Math.floor(Math.random() * 2));

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const loadProfile = async () => {
    const res = await fetchData(userEndpoints.getMe, "POST", {
      auth: getBearerHeader(userCtx.accessToken),
    });
    if (!res.ok) return;
    setDisplayName(res.data?.data?.displayName || "");
    setUsername(res.data?.data?.username || "");
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg("");

    const res = await fetchData(userEndpoints.updateMe, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { displayName, username },
    });

    if (!res.ok) {
      setProfileMsg(res.message || "Update failed.");
      return;
    }

    userCtx.setDisplayName(displayName);
    setProfileMsg("Profile updated successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }

    const res = await fetchData(userEndpoints.changePassword, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { currentPassword, newPassword },
    });

    if (!res.ok) {
      setPasswordMsg(res.message || "Password change failed.");
      return;
    }

    setPasswordMsg("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        <div style={{ padding: "24px" }}>
          <button onClick={() => navigate("/user/dashboard")}>← Back</button>

          <div
            className={css["profile-panel-card"]}
            style={{ marginTop: "16px" }}
          >
            <img
              className={css["profile-panel-icon"]}
              src={getProfileIcon(profileIconId)}
              alt="profile icon"
            />
            <div className={css["greeting"]}>Your Profile</div>
          </div>

          <div
            className={css["profile-panel-card"]}
            style={{ marginTop: "16px" }}
          >
            <form onSubmit={handleProfileUpdate}>
              <div>
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {profileMsg && <div>{profileMsg}</div>}
              <button type="submit">Save Profile</button>
            </form>
          </div>

          <div
            className={css["profile-panel-card"]}
            style={{ marginTop: "16px" }}
          >
            <form onSubmit={handlePasswordChange}>
              <div>
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordMsg && <div>{passwordMsg}</div>}
              <button type="submit">Change Password</button>
            </form>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePage;
