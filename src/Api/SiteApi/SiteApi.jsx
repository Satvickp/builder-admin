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

export const getSiteMaster = async (builderId) =>{
  const resp = await axios.get(`${baseUrl}/all/${builderId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  
  });
  console.log(resp.data)
  return resp.data;
}

export const getAllSiteMastersByState = (stateId,builderId) =>
  axios.get(`${baseUrl}/state/${stateId}/${builderId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

  export const deleteSite = async (id) => {
    await axios.delete(`${baseUrl}/delete/${id}`, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
    });
  };
