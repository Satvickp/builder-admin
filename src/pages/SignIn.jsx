import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../redux/Features/loginSlice";
import { setUser } from "../redux/Features/UserSlice";
import { BASE_URL } from "../utils/BaseUrl";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    try {
      const response = await axios.post(
        `${BASE_URL.DEV_URL}/bill-generator-service/users/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.token;

      localStorage.setItem("USER_TOKEN", token);
      const decoded = jwtDecode(token);

      dispatch(setUser(decoded));
      dispatch(loginSuccess(response.data));
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to login. Please check your credentials.";
      dispatch(loginFailure(errorMessage));
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-0 flex items-center justify-center min-h-screen w-full bg-[#1d2634] text-[#f4f5f7] font-poppins">
      <div className="flex flex-col md:flex-row h-screen w-full">
        <div className="left-panel w-full md:w-1/2 h-full p-4 md:p-8 bg-[#f4f5f7] flex flex-col justify-center">
          <div className="form-container bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-[500px] mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-black">Sign In</h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="form-group mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-md font-medium mb-4 text-gray-700">
                Please register here if you haven't before
                <Link to="/register" className="text-blue-600 underline ml-1">
                  Register
                </Link>
              </p>
              <button
                className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200`}
                type="submit"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
        <div className="right-panel w-full md:w-1/2 h-full bg-[url('signback.jpg')] bg-cover bg-center text-white flex items-center justify-center">
          <div className="right-panel-content text-center p-4 md:p-8 mb-96"></div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
