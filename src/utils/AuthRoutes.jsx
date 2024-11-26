import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import Error from "../pages/Error";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default AuthRoutes;
