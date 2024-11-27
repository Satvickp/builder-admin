import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginSuccess } from "./redux/Features/loginSlice";
import { setUser } from "./redux/Features/UserSlice";
import { jwtDecode } from "jwt-decode";
import AdminRoutes from "./utils/AdminRoutes";
import AuthRoutes from "./utils/AuthRoutes";

function App() {
  const dispatch = useDispatch();
  const Cred = useSelector(state => state.Cred);

  useEffect(() => {
    const storagetoken = window.localStorage.getItem('USER_TOKEN')
    if (!Cred && storagetoken != null) {
      try {
        const decoded = jwtDecode(storagetoken);
        dispatch(setUser(decoded));
        dispatch(loginSuccess({ storagetoken }));
      } catch (error) {
        dispatch(loginFailure("Failed to decode token."));
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {Cred ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/*" element={<AuthRoutes />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
