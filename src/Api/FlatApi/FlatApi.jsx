// src/redux/Features/FlatApi/flatApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl";


const baseUrl = `${BASE_URL.DEV_URL}/bill-generator-service/flat-masters`;


export const createFlatMaster = async (flatData) => {
  const response = await axios.post(`${baseUrl}/create`, flatData);
  return response.data;
};


export const getFlatMasterById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export const updateFlatMaster = async (id, flatData) => {
  const response = await axios.put(`${baseUrl}/update/${id}`, flatData);
  return response.data;
};

 
export const getFlatsBySiteAndState = async (siteId, stateId,builderId, page = 0, size = 10, sortBy = 'createdTime', sortDirection = 'desc') => {
  const response = await axios.get(`${baseUrl}/getAllFlatsBySiteIdAndStateId/${siteId}/${stateId}/${builderId}`, {
    params: { page, size, sortBy, sortDirection },
  });
  console.log(response)
  return response.data;
};


export const getAllFlats = async (builderId,page = 0, size = 10, sortBy = 'createdTime', sortDirection = 'desc') => {
  const response = await axios.get(`${baseUrl}/getAllFlats/${builderId}`, {
    params: { page, size, sortBy, sortDirection },
  });
  return response.data;
};























