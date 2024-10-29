// src/components/Register.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest, registerSuccess, registerFailure } from './redux/Features/registerSlice';
import axios from 'axios';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.register);

  const [formData, setFormData] = useState({
    username: '',
    builderName: '',
    password: '',
    email: '',
    mobileNo: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(registerRequest());

    try {
      const response = await axios.post(
        'http://195.35.22.253:8097/bill-generator-service/users/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        }
      );

      dispatch(registerSuccess());
      console.log('User registered:', response.data);
    } catch (error) {
      dispatch(registerFailure(error.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('Rimage.jpg')] bg-cover bg-center h-screen p-4">
      <form onSubmit={handleRegister} className="bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Register</h2>

        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="builderName"
            placeholder="Builder Name"
            value={formData.builderName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile Number"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200 ease-in-out`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">Registration Successful!</p>}
      </form>
    </div>
  );
};

export default Register;
