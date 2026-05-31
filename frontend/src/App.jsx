import React, { useContext, useState } from "react";
import HomePage from "./components/HomePage.jsx";
import { Navigate, Route, Routes } from "react-router";
import cssMain from "./styles/App.module.css";
import UserContext from "./context/UserContext.js";
import DevLogin from "./components/DevLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [displayName, setDisplayName] = useState("Guest");
  return (
    <div className={`${cssMain["main-wrapper"]}`}>
      <UserContext.Provider value={{ accessToken, setAccessToken, displayName, setDisplayName }}>
        <Routes>
          <Route path="/" element={<Navigate to="/devlogin" replace />} />
          <Route path="/devlogin" element={<DevLogin />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
