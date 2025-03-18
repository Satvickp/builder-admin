import React, { useState, useEffect } from "react";
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
import {
  sendOtp,
  verifySignupOtp,
  resetPassword,
} from "../Api/passwordApi/PasswordApi"; // Import resetPassword

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
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

  const handleForgetPassword = () => {
    setShowModal(true);
  };

  const handleSendOtp = async () => {
    try {
      const otpResponse = await sendOtp(email);
      console.log("OTP sent:", otpResponse);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (e.target.value.length > 0 && intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const verifyResponse = await verifySignupOtp(email, otp);
      setUserId(verifyResponse);
      setShowModal(false);
      setShowResetModal(true);
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      await resetPassword(userId, newPassword); // Pass userId if required
      console.log("userId", resetPassword);
      alert("Password reset successful. Please login with your new password.");
      setShowResetModal(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
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
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
                type="submit"
              >
                Sign In
              </button>
              <p
                className="mt-4 text-sm text-blue-600 cursor-pointer"
                onClick={handleForgetPassword}
              >
                Forget Password?
              </p>
            </form>
          </div>
        </div>
        <div className="right-panel w-full md:w-1/2 h-full bg-[url('signback.jpg')] bg-cover bg-center text-white flex items-center justify-center">
          <div className="right-panel-content text-center p-4 md:p-8 mb-96"></div>
        </div>
      </div>

      {/* Modal for OTP Verification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-black">
              Enter Your Email
            </h3>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for OTP Verification with Timer */}
      {otpSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-black">
              Verify OTP
            </h3>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-green-500 text-white rounded-md"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Reset Password */}
      {/* Modal for Reset Password */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-black">
              Reset Password
            </h3>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-md"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-green-500 text-white rounded-md"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
