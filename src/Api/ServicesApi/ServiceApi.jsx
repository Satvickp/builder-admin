// src/api/serviceMasterApi.js
import axios from 'axios';
import { BASE_URL } from "../../utils/BaseUrl"

// const BASE_URL = 'https://api-dev.prismgate.in/bill-generator-service/service-masters';

const baseUrl =  `${BASE_URL.DEV_URL}/bill-generator-service/service-masters`

export const createServiceMaster = (data) =>
  axios.post(`${ baseUrl}/create`, data, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const updateServiceMaster = (id, data) =>
  axios.put(`${ baseUrl}/update/${id}`, data, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getServiceMaster = (id) =>
  axios.get(`${ baseUrl}/${id}`, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

export const getAllServiceMasters = (builderId) =>
  axios.get(`${ baseUrl}/all/${builderId}`, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
