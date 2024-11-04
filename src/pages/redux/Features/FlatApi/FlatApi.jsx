// src/redux/Features/FlatApi/flatApi.js
import axios from 'axios';

const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/flat-masters';

export const createFlatMaster = async (flatData) => {
  const response = await axios.post(`${BASE_URL}/create`, flatData);
  return response.data;
};

export const getFlatMasterById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateFlatMaster = async (id, flatData) => {
  const response = await axios.put(`${BASE_URL}/update/${id}`, flatData);
  return response.data;
};
export const getAllFlatMastersBySite = (siteId) =>
  axios.get(`${BASE_URL}/site/${siteId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

