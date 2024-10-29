// src/api/siteMasterApi.js
import axios from 'axios';

const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/site-masters';

export const createSiteMaster = (data) =>
  axios.post(`${BASE_URL}/create`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const updateSiteMaster = (id, data) =>
  axios.put(`${BASE_URL}/update/${id}`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getSiteMaster = (id) =>
  axios.get(`${BASE_URL}/${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getAllSiteMastersByState = (stateId) =>
  axios.get(`${BASE_URL}/state/${stateId}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
