import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext.js";
import { sharedFetch } from "../utils/fetchingUtils.js";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import ToggleButton from "./ToggleButton.jsx";

const DevLogin = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const userCtx = useContext(UserContext);
  const fetchData = sharedFetch();
  const navigate = useNavigate();

  const handleDevLogin = async () => {
    setIsError(false);
    setError(null);

    const body = { username: "newuser", password: "password" };
    const res = await fetchData("/api/accounts/login", "POST", { body });

    if (res.ok) {
      userCtx.setAccessToken(res.data?.data.access);
      const decoded = jwtDecode(res.data?.data.access);
      if (decoded) userCtx.setDisplayName(decoded.displayName || decoded.username);
      navigate("/user/dashboard");
    } else {
      console.error(res.message);
      setError(res.message);
      setIsError(true);
    }
  };

  // -Toggle Button Use
  const [toggleState, setToggleState] = useState(false);

  return (
    <div>
      <button onClick={handleDevLogin}>DEV LOGIN</button>
      <ToggleButton isChecked={toggleState} setIsChecked={setToggleState} />
    </div>
  );
};

export default DevLogin;
