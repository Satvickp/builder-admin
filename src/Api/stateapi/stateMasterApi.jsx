// src/api.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/state-masters';

const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/state-masters`;
const token = window.localStorage.getItem("USER_TOKEN");
// console.log('token',token);

export const getStates = async (builderId) => {
  const response = await axios.get(`${baseUrl}/all/${builderId}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const createState = async (newState) => {
  const response = await axios.post(`${baseUrl}/create`, newState, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const updateState = async (id, updatedState) => {
  const response = await axios.put(`${baseUrl}/update/${id}`, updatedState, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteState = async (id) => {
  await axios.delete(`${baseUrl}/delete/${id}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
};
