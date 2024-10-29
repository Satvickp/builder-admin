// src/api.js
import axios from 'axios';

const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/state-masters';

export const getStates = async () => {
  const response = await axios.get(`${BASE_URL}/all`, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const createState = async (newState) => {
  const response = await axios.post(`${BASE_URL}/create`, newState, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateState = async (code, updatedState) => {
  const response = await axios.put(`${BASE_URL}/update/${code}`, updatedState, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteState = async (code) => {
  await axios.delete(`${BASE_URL}/delete/${code}`, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
};
