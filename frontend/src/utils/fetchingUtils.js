export const userEndpoints = {
  getActivityConfigs: "/api/activities/list",
  getRecordedActivities: "/api/activities/recorded",
  getRecordedActivityById: "/api/activities/recorded",
  createRecordedActivity: "/api/activities/recorded",
  updateRecordedActivityById: "/api/activities/recorded",
  deleteRecordedActivityById: "/api/activities/recorded",
  getMe: "/api/accounts/details",
  updateMe: "/api/accounts/details",
  changePassword: "/api/accounts/password",
  getAdminConfigs: "/api/activities/admin",
  createAdminConfig: "/api/activities/admin",
  updateAdminConfig: "/api/activities/admin",
  deleteAdminConfig: "/api/activities/admin",
  getAdminUsers: "/api/admin/accounts",
  updateAdminUserRole: "/api/admin/accounts/access",
  deleteAdminUser: "/api/admin/accounts",
};

export const getBearerHeader = (token) => {
  return { Authorization: "Bearer " + token };
};

export const sharedFetch = () => {
  const fetchData = async (endpoint, method, { auth, body }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (auth) Object.assign(headers, auth);

      const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data?.message) {
          if (Array.isArray(data.message)) {
            console.error("Array(data.message)", data.message[0].message);
            return {
              status: res.status,
              ok: false,
              message: data.message[0].message,
            };
          } else {
            console.error("data.message", data.message);
            return { status: res.status, ok: false, message: data.message };
          }
        } else {
          console.error("final", data);
          return {
            status: res.status,
            ok: false,
            message: "an unknown error has occurred, please try again later",
          };
        }
      }

      return { status: res.status, ok: true, data: data };
    } catch (error) {
      console.error(error.message);
      return { ok: false, message: "data error" };
    }
  };

  return fetchData;
};
