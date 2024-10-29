// src/api/serviceMasterApi.js
import axios from 'axios';

const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/service-masters';

export const createServiceMaster = (data) =>
  axios.post(`${BASE_URL}/create`, data, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const updateServiceMaster = (id, data) =>
  axios.put(`${BASE_URL}/update/${id}`, data, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getServiceMaster = (id) =>
  axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getAllServiceMasters = () =>
  axios.get(`${BASE_URL}/all`, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
