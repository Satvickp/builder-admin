import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "./redux/Features/loginSlice";
import { setUser } from "./redux/Features/UserSlice";
import {jwtDecode} from "jwt-decode";
import AdminRoutes from "./utils/AdminRoutes";
import AuthRoutes from "./utils/AuthRoutes";

function App() {
  const dispatch = useDispatch();
  const [token, setToken] = useState(localStorage.getItem("USER_TOKEN"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("USER_TOKEN"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(setUser(decoded));
        dispatch(loginSuccess({ token }));
      } catch (error) {
        dispatch(loginFailure("Failed to decode token."));
        console.error("Error decoding token:", error);
      }
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/*" element={<AuthRoutes />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
