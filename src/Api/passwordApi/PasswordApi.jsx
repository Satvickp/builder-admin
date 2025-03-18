import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl";

// Base URL for the API
const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/v1/forgetPassword`;


export const sendOtp = async (email) => {
  try {
    const response = await axios.post(
      `${baseUrl}/sendOtp`,
      '', 
      {
        params: {
          email: email, 
        },
        headers: {
          'accept': '*/*', 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; 
  }
};


export const verifySignupOtp = async (email, otp) => {
  try {
    const response = await axios.post(
      `${baseUrl}/verifySignupOtp`, 
      '', 
      {
        params: {
          email: email,  
          otp: otp,    
        },
        headers: {
          'accept': '*/*',  
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error; 
  }
};


export const resetPassword = async (userId, newPassword) => {
    try {
      const response = await axios.post(
        `${baseUrl}/resetPassword`,
        '',
        {
          params: {
            userId: userId,
            newPassword: newPassword,
          },
          headers: {
            'accept': '*/*',
          },
        }
      );
      console.log('rrrrr',response);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };
