// src/api/siteMasterApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl"

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/site-masters';

const baseUrl =  `${BASE_URL.DEV_URL}/bill-generator-service/site-masters`

export const createSiteMaster = (data) =>
  axios.post(`${baseUrl}/create`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const updateSiteMaster = (id, data) =>
  axios.put(`${baseUrl}/update/${id}`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getSiteMaster = async (id) =>{
  const resp = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  
  });
  console.log(resp.data)
  return resp.data;
}

export const getAllSiteMastersByState = (stateId) =>
  axios.get(`${baseUrl}/state/${stateId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
