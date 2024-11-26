import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginRequest, loginSuccess, loginFailure } from '../redux/Features/loginSlice';
import { Link, useNavigate } from 'react-router-dom';
//import jwt from 'jsonwebtoken';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.login);
  //const decoded = jwt.decode(token);
  //console.log(decoded)
 

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    try {
      const response = await axios.post('https://api-dev.prismgate.in/bill-generator-service/users/login', {
        username,
        password,
        //builderName: 'Anand Verma',
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (error) {
      dispatch(loginFailure('Failed to login. Please check your credentials.'));
      console.log("Error:: ", error);
    }
    // 
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/'); // Redirect to home page after successful login
  //   }
  // }, [isAuthenticated, navigate]);

  return (
    <div className="p-0 flex items-center justify-center min-h-screen w-full bg-[#1d2634] text-[#f4f5f7] font-poppins">
      <div className="flex flex-col md:flex-row h-screen w-full">
        {/* Left Panel */}
        <div className="left-panel w-full md:w-1/2 h-full p-4 md:p-8 bg-[#f4f5f7] flex flex-col justify-center">
          <div className="form-container bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-[500px] mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-black">Sign In</h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <Link to="/register" className="text-blue-600 underline ml-1">Register</Link>
              </p>
              <button
                className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md ${loading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600'} transition duration-200`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel w-full md:w-1/2 h-full bg-[url('signback.jpg')] bg-cover bg-center text-white flex items-center justify-center">
          <div className="right-panel-content text-center p-4 md:p-8 mb-96">
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
