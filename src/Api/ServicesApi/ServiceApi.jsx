// src/api/serviceMasterApi.js
import axios from "axios";
import { BASE_URL } from "../../utils/BaseUrl";

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/service-masters';

const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/service-masters`;

const token = window.localStorage.getItem("USER_TOKEN");
// console.log('token',token);

const getAuthHeaders = () => {
  return {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
};

export const createServiceMaster = (data) =>
  axios.post(`${baseUrl}/create`, data, getAuthHeaders());

export const updateServiceMaster = (id, data) =>
  axios.put(`${baseUrl}/update/${id}`, data, getAuthHeaders());

export const getServiceMaster = (id) =>
  axios.get(`${baseUrl}/${id}`, getAuthHeaders());

export const getAllServiceMasters = (builderId) =>
  axios.get(`${baseUrl}/all/${builderId}`, getAuthHeaders());

export const deleteService = async (id) => {
  await axios.delete(`${baseUrl}/delete/${id}`, getAuthHeaders());
};
