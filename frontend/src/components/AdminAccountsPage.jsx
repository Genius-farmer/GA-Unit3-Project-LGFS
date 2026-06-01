import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import css from "../styles/HomePage.module.css";
import UserContext from "../context/UserContext.js";
import {
  getBearerHeader,
  sharedFetch,
  userEndpoints,
} from "../utils/fetchingUtils.js";

const AdminAccountsPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

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

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetchData(userEndpoints.updateAdminUserRole, "PATCH", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { user_id: userId, role: newRole },
    });
    if (!res.ok) {
      setMsg(res.message || "Failed to update role.");
      return;
    }
    loadUsers();
  };

  const handleDelete = async (userId) => {
    const res = await fetchData(userEndpoints.deleteAdminUser, "DELETE", {
      auth: getBearerHeader(userCtx.accessToken),
      body: { user_id: userId },
    });
    if (!res.ok) {
      setMsg(res.message || "Failed to delete user.");
      return;
    }
    loadUsers();
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

          <div className={css["profile-panel-card"]}>
            <div className={css["panel-header"]}>User Accounts</div>
            {msg && <div>{msg}</div>}
            {users.length === 0 && <div>No users found.</div>}
            {users.map((u) => (
              <div
                key={u._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                }}
              >
                <div>
                  <strong>{u.username}</strong>
                  {u.displayName && (
                    <span style={{ marginLeft: "8px" }}>({u.displayName})</span>
                  )}
                  <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                    {u.role}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleRoleToggle(u._id, u.role)}>
                    {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                  </button>
                  <button onClick={() => handleDelete(u._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AdminAccountsPage;
