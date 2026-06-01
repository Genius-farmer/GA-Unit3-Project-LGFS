import React, { useContext, useEffect, useState } from "react";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import AdminNavBar from "./AdminNavBar.jsx";
import { getAsset, iconEditSrc, iconDeleteSrc } from "../utils/assetUtils.js";
import StatDisplay from "./StatDisplay.jsx";
import { getBearerHeader, sharedFetch, userEndpoints } from "../utils/fetchingUtils.js";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const AdminAccountsPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();

  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editMsg, setEditMsg] = useState("");

  const loadUsers = async () => {
    const res = await fetchData(userEndpoints.getAdminUsers, "GET", {
      auth: getBearerHeader(userCtx.accessToken),
    });
    if (!res.ok) return;
    setUsers(res.data.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditOpen = (user) => {
    setEditingId(user._id);
    setEditRole(user.role);
    setEditMsg("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditMsg("");
  };

  const handleRoleUpdate = async (e, userId) => {
    e.preventDefault();
    setEditMsg("");
    const res = await fetchData(userEndpoints.updateAdminUserRole, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { user_id: userId, role: editRole },
    });
    if (!res.ok) {
      setEditMsg(res.message || "Failed to update role.");
      return;
    }
    setEditingId(null);
    loadUsers();
  };

  const handleDelete = async (userId) => {
    const res = await fetchData(userEndpoints.deleteAdminUser, "DELETE", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { user_id: userId },
    });
    if (!res.ok) return;
    loadUsers();
  };

  return (
    <div className={css["app-wrapper"]}>
      <div></div>
      <div className={css["app-container"]}>
        <AdminNavBar />
        <div className={css["user-dashboard"]}>
          <div></div>
          <div className={css["profile-page-content"]}>
            <div className={css["admin-panel-card"]}>
              <div className={css["panel-header"]}>Manage Users</div>
              {users.length === 0 && <div>No users found.</div>}
              {users.map((u) => (
                <div key={u._id} className={css["admin-config-item"]}>
                  {editingId !== u._id ? (
                    <>
                      <div className={css["admin-config-item-header"]}>
                        <div>
                          <div className={css["header-title"]}>{u.username}</div>
                          {u.displayName && <div className={css["header-sub"]}>{u.displayName}</div>}
                        </div>
                        <div>
                          {u.username !== userCtx.username && (
                            <>
                              <button
                                className={`${css["action-icon-button"]} ${css["button-border"]}`}
                                onClick={() => handleEditOpen(u)}
                              >
                                <img className={css["button-icon"]} src={getAsset(iconEditSrc)} alt="edit" />
                              </button>
                              <button className={css["action-icon-button"]} onClick={() => handleDelete(u._id)}>
                                <img className={css["button-icon"]} src={getAsset(iconDeleteSrc)} alt="delete" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={css["admin-toggle-row"]}>{u.role}</div>
                    </>
                  ) : (
                    <form onSubmit={(e) => handleRoleUpdate(e, u._id)}>
                      <div className={css["admin-config-item-header"]}>
                        <div>
                          <div className={css["header-title"]}>{u.username}</div>
                          {u.displayName && <div className={css["header-sub"]}>{u.displayName}</div>}
                        </div>
                      </div>
                      <div className={css["admin-checkbox-list"]}>
                        {roleOptions.map((r) => (
                          <label key={r.value}>
                            <input
                              type="radio"
                              name={`role-${u._id}`}
                              value={r.value}
                              checked={editRole === r.value}
                              onChange={(e) => setEditRole(e.target.value)}
                            />{" "}
                            {r.label}
                          </label>
                        ))}
                      </div>
                      {editMsg && <div className={css["admin-msg-error"]}>{editMsg}</div>}
                      <div className={css["dialog-footer"]}>
                        <div>
                          <button className={css["text-button"]} type="submit">
                            Save
                          </button>
                          <button className={css["text-button-cancel"]} type="button" onClick={handleEditCancel}>
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
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AdminAccountsPage;
