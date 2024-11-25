// src/redux/Features/FlatApi/flatApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl";

// Base URL for flat API
const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/flat-masters`;

// Function to create a new flat
export const createFlatMaster = async (flatData) => {
  const response = await axios.post(`${baseUrl}/create`, flatData);
  return response.data;
};

// Function to get a flat by its ID
export const getFlatMasterById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

// Function to update an existing flat by its ID
export const updateFlatMaster = async (id, flatData) => {
  const response = await axios.put(`${baseUrl}/update/${id}`, flatData);
  return response.data;
};

// New function to fetch flats by site ID and state ID with pagination and sorting
export const getFlatsBySiteAndState = async (siteId, stateId) => {
  // try {
    const response = await axios.get(`${baseUrl}/getAllFlatsBySiteIdAndStateId/${siteId}/${stateId}`,);
      // params: {
      //   page: page,
      //   size: size,
      //   sortBy: sortBy,
      //   sortDirection: sortDirection
      // }
  
    return response.data;
 
};




















// import axios from 'axios';
//   import { BASE_URL } from "../../utils/BaseUrl"
  
//   //const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/flat-masters';
  
//   const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/flat-masters`
  
//   // Function to create a new flat
//   export const createFlatMaster = async (flatData) => {
//     const response = await axios.post(`${baseUrl}/create, flatData`);
//     return response.data;
//   };
  
//   // Function to get a flat by its ID
//   export const getFlatMasterById = async (id) => {
//     const response = await axios.get(`${baseUrl}/${id}`);
//     return response.data;
//   };
  
//   // Function to update an existing flat by its ID
//   export const updateFlatMaster = async (id, flatData) => {
//     const response = await axios.put(`${baseUrl}/update/${id}, flatData`);
//     return response.data;
//   };
  
//   // New function to fetch flats by site ID and state ID
  
//   export const getFlatsBySiteAndState = async (siteId, stateId, page = 0, size = 10, sortBy = 'createdTime', sortDirection = 'desc') => {
//       try {
//         const response = await axios.get(`${baseUrl}/getAllFlatsBySiteIdAndStateId/${siteId}/${stateId}`, {
//           params: {
//             page: page,
//             size: size,
//             sortBy: sortBy,
//             sortDirection: sortDirection
//           }
//         });
//         return response.data;
//       } catch (err) {
//         throw new Error('Failed to fetch flats: ' + err.message);
//       }
//     };

