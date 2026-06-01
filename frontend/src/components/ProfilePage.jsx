import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import { getProfileIcon } from "../utils/profileUtils.js";
import { getAsset, iconEditSrc } from "../utils/assetUtils.js";
import UserContext from "../context/UserContext.js";
import UserNavBar from "./UserNavBar.jsx";
import AdminNavBar from "./AdminNavBar.jsx";
import StatDisplay from "./StatDisplay.jsx";
import StatTextInput from "./StatTextInput.jsx";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";

const ProfilePage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [profileIconId] = useState(0);

  const [currentUsername, setCurrentUsername] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const loadProfile = async () => {
    const res = await fetchData(userEndpoints.getMe, "POST", {
      auth: getBearerHeader(userCtx.accessToken),
    });
    if (!res.ok) return;
    setDisplayName(res.data?.data?.displayName || "");
    setUsername(res.data?.data?.username || "");
    setCurrentUsername(res.data?.data?.username || "");
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
    setCurrentUsername(username);
    setProfileMsg("Profile updated successfully!");
    setIsEditingProfile(false);
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
    setIsEditingPassword(false);
  };

  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        {userCtx.role === "admin" ? <AdminNavBar /> : <UserNavBar />}
        <div className={css["user-dashboard"]}>
          <div></div>
          <div className={css["profile-page-content"]}>
            {/* Profile icon card */}
            <div className={css["profile-page-card"]}>
              <img className={css["profile-page-icon"]} src={getProfileIcon(profileIconId)} alt="profile icon" />
              <div className={css["greeting"]}>{userCtx.displayName}</div>
            </div>

            {/* Profile details card */}
            <div className={css["profile-page-card"]}>
              <div className={css["profile-page-card-header"]}>
                <div className={css["panel-header"]}>Profile Details</div>
                <button
                  className={`${css["action-icon-button"]} ${css["button-border"]}`}
                  onClick={() => {
                    setIsEditingProfile((prev) => !prev);
                    setProfileMsg("");
                    setDisplayName(userCtx.displayName);
                    setUsername(currentUsername);
                  }}
                >
                  <img className={css["button-icon"]} src={getAsset(iconEditSrc)} alt="edit icon" />
                </button>
              </div>

              {!isEditingProfile && (
                <div className={css["profile-page-stat-list"]}>
                  <StatDisplay title="Display Name" value={userCtx.displayName || "-"} />
                  <StatDisplay title="Username" value={currentUsername || "-"} />
                </div>
              )}

              {isEditingProfile && (
                <form onSubmit={handleProfileUpdate}>
                  <div className={css["profile-page-stat-list"]}>
                    <StatTextInput
                      title="Display Name"
                      value={displayName}
                      setValue={setDisplayName}
                      size={css["stat-input-md"]}
                    />
                    <StatTextInput
                      title="Username"
                      value={username}
                      setValue={setUsername}
                      size={css["stat-input-md"]}
                    />
                  </div>
                  {profileMsg && (
                    <div
                      className={profileMsg.includes("success") ? css["profile-msg-success"] : css["profile-msg-error"]}
                    >
                      {profileMsg}
                    </div>
                  )}
                  <div className={css["profile-form-footer"]}>
                    <div>
                      <button className={css["text-button"]} type="submit">
                        Save
                      </button>
                      <button
                        className={css["text-button-cancel"]}
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileMsg("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Password card */}
            <div className={css["profile-page-card"]}>
              <div className={css["profile-page-card-header"]}>
                <div className={css["panel-header"]}>Password</div>
                <button
                  className={`${css["action-icon-button"]} ${css["button-border"]}`}
                  onClick={() => {
                    setIsEditingPassword((prev) => !prev);
                    setPasswordMsg("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  <img className={css["button-icon"]} src={getAsset(iconEditSrc)} alt="edit icon" />
                </button>
              </div>

              {!isEditingPassword && <StatDisplay title="Password" value="••••••••" />}

              {isEditingPassword && (
                <form onSubmit={handlePasswordChange}>
                  <div className={css["profile-page-stat-list"]}>
                    <StatTextInput
                      title="Current Password"
                      value={currentPassword}
                      setValue={setCurrentPassword}
                      size={css["stat-input-md"]}
                      type="password"
                    />
                    <StatTextInput
                      title="New Password"
                      value={newPassword}
                      setValue={setNewPassword}
                      size={css["stat-input-md"]}
                      type="password"
                    />
                    <StatTextInput
                      title="Confirm New Password"
                      value={confirmPassword}
                      setValue={setConfirmPassword}
                      size={css["stat-input-md"]}
                      type="password"
                    />
                  </div>
                  {passwordMsg && (
                    <div
                      className={
                        passwordMsg.includes("success") ? css["profile-msg-success"] : css["profile-msg-error"]
                      }
                    >
                      {passwordMsg}
                    </div>
                  )}
                  <div className={css["dialog-footer"]}>
                    <div>
                      <button className={css["text-button"]} type="submit">
                        Save
                      </button>
                      <button
                        className={css["text-button-cancel"]}
                        type="button"
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordMsg("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePage;
